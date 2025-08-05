import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Popup } from 'semantic-ui-react';
import { ProductInstance, ProductInstanceStatus, Roles } from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import {
  formatTranslateStatus,
  getCompletedStatuses,
  getLastDocumentStatus,
  getStatusDescriptionMap,
  StatusDescriptionMap,
} from '../../helpers/activity';
import { createInstanceStatusSingle } from '../../stores/productinstance/actionCreator';
import AuthorizationComponent from '../AuthorizationComponent';
import { authedUserHasRole } from '../../stores/auth/selectors';
import { RootState } from '../../stores/store';
import FinancialDocumentProgress from './FinancialDocumentProgress';
import FinancialDocumentStep, { FinancialDocumentStepStatus } from './FinancialDocumentStep';
import FinancialDocumentStatusModal from './FinancialDocumentStatusModal';

const ORDERED_PRODUCT_INSTANCE_STATUSES = [ProductInstanceStatus.NOTDELIVERED, ProductInstanceStatus.DELIVERED];

interface Props {
  productInstance: ProductInstance;
  resourceStatus: ResourceStatus;
}

function getPrerequisiteStatuses(a: ProductInstanceStatus): Set<ProductInstanceStatus> {
  if (a === ProductInstanceStatus.DELIVERED)
    return new Set([ProductInstanceStatus.DELIVERED, ...getPrerequisiteStatuses(ProductInstanceStatus.NOTDELIVERED)]);
  if (a === ProductInstanceStatus.NOTDELIVERED) return new Set([ProductInstanceStatus.NOTDELIVERED]);
  return new Set();
}

function getNextPossibleStatuses(s: ProductInstanceStatus): ProductInstanceStatus[] {
  switch (s) {
    case ProductInstanceStatus.NOTDELIVERED:
      return [ProductInstanceStatus.DELIVERED];
  }
  return [];
}

function ProductInstanceProgress({ productInstance, resourceStatus }: Props) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const hasRole = useSelector((state: RootState) => (role: Roles) => authedUserHasRole(state, role));

  const [activityMap, setActivityMap] = useState<StatusDescriptionMap<ProductInstanceStatus>>(new Map());
  const [lastStatus, setLastStatus] = useState<ProductInstanceStatus>(ProductInstanceStatus.NOTDELIVERED);
  const [completedStatuses, setCompletedStatuses] = useState<Set<ProductInstanceStatus>>(new Set());
  const [nextPossibleStatuses, setNextPossibleStatuses] = useState<Set<ProductInstanceStatus>>(new Set());

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [deferModalOpen, setDeferModalOpen] = useState(false);

  useEffect(() => {
    const newActivityMap = getStatusDescriptionMap(productInstance.activities);
    setActivityMap(newActivityMap);

    const lastDocumentStatus =
      getLastDocumentStatus(
        [...newActivityMap.keys()],
        [...ORDERED_PRODUCT_INSTANCE_STATUSES, ProductInstanceStatus.CANCELLED, ProductInstanceStatus.DEFERRED],
      ) ?? ProductInstanceStatus.NOTDELIVERED;
    setLastStatus(lastDocumentStatus);

    const newCompletedStatuses = getCompletedStatuses([lastDocumentStatus], getPrerequisiteStatuses);
    setCompletedStatuses(newCompletedStatuses);

    const newNextPossibleStatuses = new Set(getNextPossibleStatuses(lastDocumentStatus));
    setNextPossibleStatuses(newNextPossibleStatuses);
  }, [productInstance]);

  const authorizedToEdit = (): boolean => {
    return [Roles.GENERAL, Roles.ADMIN].some((r) => hasRole(r));
  };

  const getStatusForActivity = (activity: ProductInstanceStatus): FinancialDocumentStepStatus | undefined => {
    if (activityMap.has(ProductInstanceStatus.DEFERRED)) return FinancialDocumentStepStatus.DEFERRED;
    if (completedStatuses.has(activity)) return FinancialDocumentStepStatus.COMPLETED;
    if (activityMap.has(ProductInstanceStatus.CANCELLED)) return FinancialDocumentStepStatus.CANCELLED;
    if (nextPossibleStatuses.has(activity) && authorizedToEdit()) return FinancialDocumentStepStatus.CREATABLE;
    return undefined;
  };

  const onStatusSave = (documentStatus: ProductInstanceStatus, description: string): void => {
    dispatch(
      createInstanceStatusSingle(productInstance.contractId, productInstance.id, {
        subType: documentStatus,
        description,
      }),
    );
  };

  const getDescription = (documentStatus: ProductInstanceStatus): string | undefined => {
    const descriptions = activityMap.get(documentStatus);
    // Status does not exist, so return undefined. This indicates to the step as well that the status does not exist
    if (!descriptions) return undefined;
    if (i18n.language === 'nl-NL') return descriptions.descriptionDutch;
    return descriptions.descriptionEnglish;
  };

  const getTitle = (): string => {
    if (lastStatus === ProductInstanceStatus.CANCELLED) {
      return t('activities.status.header.cancelled', { entity: t('entity.productinstance') });
    }
    if (lastStatus === ProductInstanceStatus.DEFERRED) {
      return t('activities.status.header.deferred', { entity: t('entity.productinstance') });
    }
    return t('activities.status.header.general', { entity: t('entity.productinstance') });
  };

  const deferButton = () => {
    return (
      <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
        <Popup
          trigger={
            <Button
              floated="left"
              labelPosition="left"
              icon="close"
              basic
              onClick={() => {
                setDeferModalOpen(true);
              }}
              content={t('activities.status.defer', { entity: t('entity.productinstance') })}
              disabled={[ProductInstanceStatus.CANCELLED, ProductInstanceStatus.DEFERRED].includes(lastStatus)}
            />
          }
          header={t('activities.status.defer', { entity: t('entity.productinstance').toLowerCase() })}
          content={t('activities.status.deferDescription', { entity: t('entity.productinstance').toLowerCase() })}
        />
        <FinancialDocumentStatusModal
          documentStatus={ProductInstanceStatus.DEFERRED}
          documentStatusText={t('entities.status.deferred')}
          open={deferModalOpen}
          resourceStatus={resourceStatus}
          onClose={() => setDeferModalOpen(false)}
          onSave={(documentStatus, description) => {
            onStatusSave(documentStatus, description);
            setDeferModalOpen(false);
          }}
        />
      </AuthorizationComponent>
    );
  };

  const cancelButton = () => {
    return (
      <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
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
                entity: t('entity.productinstance'),
              })}
              disabled={[ProductInstanceStatus.CANCELLED, ProductInstanceStatus.DEFERRED].includes(lastStatus)}
            />
          }
          header={t('activities.status.cancel', { entity: t('entity.productinstance') })}
          content={() => {
            return t('activities.status.cancelProductInstanceDescription');
          }}
        />
        <FinancialDocumentStatusModal
          documentStatus={ProductInstanceStatus.CANCELLED}
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
      leftButton={deferButton()}
      rightButton={cancelButton()}
    >
      {ORDERED_PRODUCT_INSTANCE_STATUSES.map((s) => {
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

export default ProductInstanceProgress;
