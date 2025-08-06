import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, Popup } from 'semantic-ui-react';
import { Invoice, InvoiceActivity, InvoiceStatus, Roles } from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import { getLastDocumentStatusFromActivities } from '../../helpers/activity';
import { createSingleStatus } from '../../stores/single/actionCreators';
import { SingleEntities } from '../../stores/single/single';
import AuthorizationComponent from '../AuthorizationComponent';
import FinancialDocumentProgress from './FinancialDocumentProgress';
import FinancialDocumentStatusModal from './FinancialDocumentStatusModal';

const INVOICE_STATUS_STEPS = [InvoiceStatus.CREATED, InvoiceStatus.PROPOSED, InvoiceStatus.SENT, InvoiceStatus.PAID];
const INVOICE_STATUS_ORDERING = [...INVOICE_STATUS_STEPS, InvoiceStatus.CANCELLED, InvoiceStatus.IRRECOVERABLE];
const INITIAL_STATUS = InvoiceStatus.CREATED;
const APPLICABLE_ROLES = [Roles.ADMIN, Roles.GENERAL, Roles.FINANCIAL];

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
  return new Set([a]);
}

function getNextPossibleStatuses(s: InvoiceStatus): Set<InvoiceStatus> {
  switch (s) {
    case InvoiceStatus.CREATED:
      return new Set([InvoiceStatus.PROPOSED, InvoiceStatus.SENT]);
    case InvoiceStatus.PROPOSED:
      return new Set([InvoiceStatus.SENT]);
    case InvoiceStatus.SENT:
      return new Set([InvoiceStatus.PAID]);
  }
  return new Set();
}

function InvoiceProgress({ invoice, resourceStatus }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [lastStatus, setLastStatus] = useState<InvoiceStatus>(INITIAL_STATUS);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [irrecoverableModalOpen, setIrrecoverableModalOpen] = useState(false);

  useEffect(() => {
    const mostRecentStatus = getLastDocumentStatusFromActivities(invoice.activities, INVOICE_STATUS_ORDERING);
    setLastStatus(mostRecentStatus ?? INITIAL_STATUS);
  }, [invoice]);

  const onStatusSave = (documentStatus: InvoiceStatus, description: string): void => {
    dispatch(createSingleStatus(SingleEntities.Invoice, invoice.id, { subType: documentStatus, description }));
  };

  const irrecoverableButton = () => {
    return (
      <AuthorizationComponent roles={APPLICABLE_ROLES} notFound={false}>
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
        <FinancialDocumentStatusModal<InvoiceActivity>
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
      <AuthorizationComponent roles={APPLICABLE_ROLES} notFound={false}>
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
        <FinancialDocumentStatusModal<InvoiceActivity>
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
      formattedEntityName={t('entity.invoice')}
      leftButton={irrecoverableButton()}
      rightButton={cancelButton()}
      activities={invoice.activities}
      orderedStatuses={INVOICE_STATUS_ORDERING}
      statusesToShow={INVOICE_STATUS_STEPS}
      initialStatus={INITIAL_STATUS}
      cancelledStatus={InvoiceStatus.CANCELLED}
      getPrerequisiteStatuses={getPrerequisiteStatuses}
      getNextPossibleStatuses={getNextPossibleStatuses}
      onStatusSave={onStatusSave}
      roles={APPLICABLE_ROLES}
    />
  );
}

export default InvoiceProgress;
