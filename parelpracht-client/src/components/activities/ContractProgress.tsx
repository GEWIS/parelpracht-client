import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, Popup } from 'semantic-ui-react';
import { Contract, ContractActivity, ContractStatus, Roles } from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import { getLastDocumentStatusFromActivities } from '../../helpers/activity';
import { createSingleStatus } from '../../stores/single/actionCreators';
import { SingleEntities } from '../../stores/single/single';
import AuthorizationComponent from '../AuthorizationComponent';
import FinancialDocumentProgress from './FinancialDocumentProgress';
import FinancialDocumentStatusModal from './FinancialDocumentStatusModal';

const CONTRACT_STATUS_STEPS = [
  ContractStatus.CREATED,
  ContractStatus.PROPOSED,
  ContractStatus.SENT,
  ContractStatus.CONFIRMED,
  ContractStatus.FINISHED,
];
const CONTRACT_STATUS_ORDERING = [...CONTRACT_STATUS_STEPS, ContractStatus.CANCELLED];
const INITIAL_STATUS = ContractStatus.CREATED;
const APPLICABLE_ROLES = [Roles.ADMIN, Roles.GENERAL];

interface Props {
  contract: Contract;
  resourceStatus: ResourceStatus;
}

function getPrerequisiteStatuses(a: ContractStatus): Set<ContractStatus> {
  if (a === ContractStatus.FINISHED)
    return new Set([ContractStatus.FINISHED, ...getPrerequisiteStatuses(ContractStatus.CONFIRMED)]);
  if (a === ContractStatus.CONFIRMED)
    return new Set([ContractStatus.CONFIRMED, ...getPrerequisiteStatuses(ContractStatus.SENT)]);
  if (a === ContractStatus.SENT)
    return new Set([
      ContractStatus.SENT,
      ...getPrerequisiteStatuses(ContractStatus.PROPOSED),
      ...getPrerequisiteStatuses(ContractStatus.CREATED),
    ]);
  if (a === ContractStatus.PROPOSED)
    return new Set([ContractStatus.PROPOSED, ...getPrerequisiteStatuses(ContractStatus.CREATED)]);
  if (a === ContractStatus.CREATED) return new Set([ContractStatus.CREATED]);
  return new Set([a]);
}

function getNextPossibleStatuses(s: ContractStatus): Set<ContractStatus> {
  switch (s) {
    case ContractStatus.CREATED:
      return new Set([ContractStatus.PROPOSED, ContractStatus.SENT]);
    case ContractStatus.PROPOSED:
      return new Set([ContractStatus.SENT]);
    case ContractStatus.SENT:
      return new Set([ContractStatus.CONFIRMED]);
    case ContractStatus.CONFIRMED:
      return new Set([ContractStatus.FINISHED]);
  }
  return new Set();
}

function ContractProgress({ contract, resourceStatus }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [lastStatus, setLastStatus] = useState<ContractStatus>(INITIAL_STATUS);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  useEffect(() => {
    const mostRecentStatus = getLastDocumentStatusFromActivities(contract.activities, CONTRACT_STATUS_ORDERING);
    setLastStatus(mostRecentStatus ?? INITIAL_STATUS);
  }, [contract]);

  const onStatusSave = (documentStatus: ContractStatus, description: string): void => {
    dispatch(createSingleStatus(SingleEntities.Contract, contract.id, { subType: documentStatus, description }));
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
                entity: t('entity.contract'),
              })}
              disabled={[ContractStatus.CANCELLED, ContractStatus.FINISHED].includes(lastStatus)}
            />
          }
          header={t('activities.status.cancel', { entity: t('entity.contract') })}
          content={() => {
            return t('activities.status.cancelContractDescription');
          }}
        />
        <FinancialDocumentStatusModal<ContractActivity>
          documentStatus={ContractStatus.CANCELLED}
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
      formattedEntityName={t('entity.contract')}
      rightButton={cancelButton()}
      activities={contract.activities}
      orderedStatuses={CONTRACT_STATUS_ORDERING}
      statusesToShow={CONTRACT_STATUS_STEPS}
      initialStatus={INITIAL_STATUS}
      cancelledStatus={ContractStatus.CANCELLED}
      getPrerequisiteStatuses={getPrerequisiteStatuses}
      getNextPossibleStatuses={getNextPossibleStatuses}
      onStatusSave={onStatusSave}
      roles={APPLICABLE_ROLES}
    />
  );
}

export default ContractProgress;
