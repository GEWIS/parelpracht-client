import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Popup } from 'semantic-ui-react';
import { Invoice, InvoiceStatus, Roles } from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import {
  formatTranslateStatus,
  getCompletedStatuses,
  getLastDocumentStatus,
  getStatusDescriptionMap,
  StatusDescriptionMap,
} from '../../helpers/activity';
import { createSingleStatus } from '../../stores/single/actionCreators';
import { SingleEntities } from '../../stores/single/single';
import AuthorizationComponent from '../AuthorizationComponent';
import { authedUserHasRole } from '../../stores/auth/selectors';
import { RootState } from '../../stores/store';
import FinancialDocumentProgress from './FinancialDocumentProgress';
import FinancialDocumentStep, { FinancialDocumentStepStatus } from './FinancialDocumentStep';
import FinancialDocumentStatusModal from './FinancialDocumentStatusModal';

const ORDERED_INVOICE_STATUSES = [
  InvoiceStatus.CREATED,
  InvoiceStatus.PROPOSED,
  InvoiceStatus.SENT,
  InvoiceStatus.PAID,
];

interface Props {
  invoice: Invoice;
  resourceStatus: ResourceStatus;
}

function getPrerequisiteStatuses(a: InvoiceStatus): Set<InvoiceStatus> {
  if (a === InvoiceStatus.PAID) return new Set([InvoiceStatus.PAID, ...getPrerequisiteStatuses(InvoiceStatus.SENT)]);
  if (a === InvoiceStatus.SENT)
    return new Set([
      InvoiceStatus.SENT,
      ...getPrerequisiteStatuses(InvoiceStatus.PROPOSED),
      ...getPrerequisiteStatuses(InvoiceStatus.CREATED),
    ]);
  if (a === InvoiceStatus.PROPOSED)
    return new Set([InvoiceStatus.PROPOSED, ...getPrerequisiteStatuses(InvoiceStatus.CREATED)]);
  if (a === InvoiceStatus.CREATED) return new Set([InvoiceStatus.CREATED]);
  return new Set();
}

function getNextPossibleStatuses(s: InvoiceStatus): InvoiceStatus[] {
  switch (s) {
    case InvoiceStatus.CREATED:
      return [InvoiceStatus.PROPOSED, InvoiceStatus.SENT];
    case InvoiceStatus.PROPOSED:
      return [InvoiceStatus.SENT];
    case InvoiceStatus.SENT:
      return [InvoiceStatus.PAID];
  }
  return [];
}

function InvoiceProgress({ invoice, resourceStatus }: Props) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const hasRole = useSelector((state: RootState) => (role: Roles) => authedUserHasRole(state, role));

  const [activityMap, setActivityMap] = useState<StatusDescriptionMap<InvoiceStatus>>(new Map());
  const [lastStatus, setLastStatus] = useState<InvoiceStatus>(InvoiceStatus.CREATED);
  const [completedStatuses, setCompletedStatuses] = useState<Set<InvoiceStatus>>(new Set());
  const [nextPossibleStatuses, setNextPossibleStatuses] = useState<Set<InvoiceStatus>>(new Set());

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [irrecoverableModalOpen, setIrrecoverableModalOpen] = useState(false);

  useEffect(() => {
    const newActivityMap = getStatusDescriptionMap(invoice.activities);
    setActivityMap(newActivityMap);

    const lastDocumentStatus =
      getLastDocumentStatus(
        [...newActivityMap.keys()],
        [...ORDERED_INVOICE_STATUSES, InvoiceStatus.CANCELLED, InvoiceStatus.IRRECOVERABLE],
      ) ?? InvoiceStatus.CREATED;
    setLastStatus(lastDocumentStatus);

    const newCompletedStatuses = getCompletedStatuses([lastDocumentStatus], getPrerequisiteStatuses);
    setCompletedStatuses(newCompletedStatuses);

    const newNextPossibleStatuses = new Set(getNextPossibleStatuses(lastDocumentStatus));
    setNextPossibleStatuses(newNextPossibleStatuses);
  }, [invoice]);

  const authorizedToEdit = (): boolean => {
    return [Roles.GENERAL, Roles.ADMIN, Roles.FINANCIAL].some((r) => hasRole(r));
  };

  const getStatusForActivity = (activity: InvoiceStatus): FinancialDocumentStepStatus | undefined => {
    if (completedStatuses.has(activity)) return FinancialDocumentStepStatus.COMPLETED;
    if (activityMap.has(InvoiceStatus.CANCELLED)) return FinancialDocumentStepStatus.CANCELLED;
    if (nextPossibleStatuses.has(activity) && authorizedToEdit()) return FinancialDocumentStepStatus.CREATABLE;
    return undefined;
  };

  const onStatusSave = (documentStatus: InvoiceStatus, description: string): void => {
    dispatch(createSingleStatus(SingleEntities.Invoice, invoice.id, { subType: documentStatus, description }));
  };

  const getDescription = (documentStatus: InvoiceStatus): string | undefined => {
    const descriptions = activityMap.get(documentStatus);
    // Status does not exist, so return undefined. This indicates to the step as well that the status does not exist
    if (!descriptions) return undefined;
    if (i18n.language === 'nl-NL') return descriptions.descriptionDutch;
    return descriptions.descriptionEnglish;
  };

  const getTitle = (): string => {
    if (lastStatus === InvoiceStatus.CANCELLED) {
      return t('activities.status.header.cancelled', { entity: t('entity.invoice') });
    }
    if (lastStatus === InvoiceStatus.IRRECOVERABLE) {
      return t('activities.status.header.irrecoverable', { entity: t('entity.invoice') });
    }
    return t('activities.status.header.general', { entity: t('entity.invoice') });
  };

  const irrecoverableButton = () => {
    return (
      <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN, Roles.FINANCIAL]} notFound={false}>
        <Popup
          trigger={
            <Button
              floated="left"
              labelPosition="left"
              icon="close"
              basic
              onClick={() => {
                setIrrecoverableModalOpen(true);
              }}
              content={t('activities.status.irrecoverable')}
              disabled={[InvoiceStatus.CANCELLED, InvoiceStatus.PAID, InvoiceStatus.IRRECOVERABLE].includes(lastStatus)}
            />
          }
          header={t('activities.status.irrecoverable')}
          content={() => {
            return t('activities.status.irrecoverableDescription');
          }}
        />
        <FinancialDocumentStatusModal
          documentStatus={InvoiceStatus.IRRECOVERABLE}
          documentStatusText={t('entities.status.irrecoverable')}
          open={irrecoverableModalOpen}
          resourceStatus={resourceStatus}
          onClose={() => setIrrecoverableModalOpen(false)}
          onSave={(documentStatus, description) => {
            onStatusSave(documentStatus, description);
            setIrrecoverableModalOpen(false);
          }}
        />
      </AuthorizationComponent>
    );
  };

  const cancelButton = () => {
    return (
      <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN, Roles.FINANCIAL]} notFound={false}>
        <Popup
          trigger={
            <Button
              floated="right"
              labelPosition="left"
              icon="close"
              basic
              onClick={() => {
                setCancelModalOpen(true);
              }}
              content={t('activities.status.cancel', {
                entity: t('entity.invoice'),
              })}
              disabled={[InvoiceStatus.CANCELLED, InvoiceStatus.PAID, InvoiceStatus.IRRECOVERABLE].includes(lastStatus)}
            />
          }
          header={t('activities.status.cancel', { entity: t('entity.invoice') })}
          content={() => {
            return t('activities.status.cancelInvoiceDescription');
          }}
        />
        <FinancialDocumentStatusModal
          documentStatus={InvoiceStatus.CANCELLED}
          documentStatusText={t('entities.status.cancelled')}
          open={cancelModalOpen}
          resourceStatus={resourceStatus}
          onClose={() => setCancelModalOpen(false)}
          onSave={(documentStatus, description) => {
            onStatusSave(documentStatus, description);
            setCancelModalOpen(false);
          }}
        />
      </AuthorizationComponent>
    );
  };

  return (
    <FinancialDocumentProgress
      resourceStatus={resourceStatus}
      title={getTitle()}
      leftButton={irrecoverableButton()}
      rightButton={cancelButton()}
    >
      {ORDERED_INVOICE_STATUSES.map((s) => {
        return (
          <FinancialDocumentStep
            key={s}
            title={formatTranslateStatus(s)}
            stepStatus={getStatusForActivity(s)}
            documentStatus={s}
            description={getDescription(s)}
            resourceStatus={resourceStatus}
            onSave={onStatusSave}
          />
        );
      })}
    </FinancialDocumentProgress>
  );
}

export default InvoiceProgress;
