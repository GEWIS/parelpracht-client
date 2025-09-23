import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, Popup } from 'semantic-ui-react';
import { ProductInstance, ProductInstanceActivity, ProductInstanceStatus, Roles } from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import { getLastDocumentStatusFromActivities } from '../../helpers/activity';
import { createInstanceStatusSingle } from '../../stores/productinstance/actionCreator';
import AuthorizationComponent from '../AuthorizationComponent';
import FinancialDocumentProgress from './FinancialDocumentProgress';
import FinancialDocumentStatusModal from './FinancialDocumentStatusModal';

const PRODUCT_INSTANCE_STATUS_STEPS = [ProductInstanceStatus.NOTDELIVERED, ProductInstanceStatus.DELIVERED];
const PRODUCT_INSTANCE_STATUS_ORDERING = [
  ...PRODUCT_INSTANCE_STATUS_STEPS,
  ProductInstanceStatus.DEFERRED,
  ProductInstanceStatus.CANCELLED,
];
const INITIAL_STATUS = ProductInstanceStatus.NOTDELIVERED;
const APPLICABLE_ROLES = [Roles.ADMIN, Roles.GENERAL];

interface Props {
  productInstance: ProductInstance;
  resourceStatus: ResourceStatus;
}

function getPrerequisiteStatuses(a: ProductInstanceStatus): Set<ProductInstanceStatus> {
  if (a === ProductInstanceStatus.DELIVERED)
    return new Set([ProductInstanceStatus.DELIVERED, ...getPrerequisiteStatuses(ProductInstanceStatus.NOTDELIVERED)]);
  if (a === ProductInstanceStatus.NOTDELIVERED) return new Set([ProductInstanceStatus.NOTDELIVERED]);
  return new Set([a]);
}

function getNextPossibleStatuses(s: ProductInstanceStatus): Set<ProductInstanceStatus> {
  switch (s) {
    case ProductInstanceStatus.NOTDELIVERED:
      return new Set([ProductInstanceStatus.DELIVERED]);
  }
  return new Set();
}

function ProductInstanceProgress({ productInstance, resourceStatus }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [lastStatus, setLastStatus] = useState<ProductInstanceStatus>(INITIAL_STATUS);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [deferModalOpen, setDeferModalOpen] = useState(false);

  useEffect(() => {
    const mostRecentStatus = getLastDocumentStatusFromActivities(
      productInstance.activities,
      PRODUCT_INSTANCE_STATUS_ORDERING,
    );
    setLastStatus(mostRecentStatus ?? INITIAL_STATUS);
  }, [productInstance]);

  const onStatusSave = (documentStatus: ProductInstanceStatus, description: string): void => {
    dispatch(
      createInstanceStatusSingle(productInstance.contractId, productInstance.id, {
        subType: documentStatus,
        description,
      }),
    );
  };

  const deferButton = () => {
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
                setDeferModalOpen(true);
              }}
              content={t('activities.status.defer', { entity: t('entity.productinstance') })}
              disabled={[ProductInstanceStatus.CANCELLED, ProductInstanceStatus.DEFERRED].includes(lastStatus)}
            />
          }
          header={t('activities.status.defer', { entity: t('entity.productinstance').toLowerCase() })}
          content={t('activities.status.deferDescription', { entity: t('entity.productinstance').toLowerCase() })}
        />
        <FinancialDocumentStatusModal<ProductInstanceActivity>
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
        <FinancialDocumentStatusModal<ProductInstanceActivity>
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
      formattedEntityName={t('entity.productinstance')}
      leftButton={deferButton()}
      rightButton={cancelButton()}
      activities={productInstance.activities}
      orderedStatuses={PRODUCT_INSTANCE_STATUS_ORDERING}
      statusesToShow={PRODUCT_INSTANCE_STATUS_STEPS}
      initialStatus={INITIAL_STATUS}
      cancelledStatus={ProductInstanceStatus.CANCELLED}
      deferredStatus={ProductInstanceStatus.DEFERRED}
      getPrerequisiteStatuses={getPrerequisiteStatuses}
      getNextPossibleStatuses={getNextPossibleStatuses}
      onStatusSave={onStatusSave}
      roles={APPLICABLE_ROLES}
    />
  );
}

export default ProductInstanceProgress;
