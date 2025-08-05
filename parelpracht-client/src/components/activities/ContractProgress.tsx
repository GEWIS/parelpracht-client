import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Popup } from 'semantic-ui-react';
import { Contract, ContractStatus, Roles } from '../../clients/server.generated';
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
import { RootState } from '../../stores/store';
import { authedUserHasRole } from '../../stores/auth/selectors';
import FinancialDocumentProgress from './FinancialDocumentProgress';
import FinancialDocumentStep, { FinancialDocumentStepStatus } from './FinancialDocumentStep';
import FinancialDocumentStatusModal from './FinancialDocumentStatusModal';

const ORDERED_CONTRACT_STATUSES = [
  ContractStatus.CREATED,
  ContractStatus.PROPOSED,
  ContractStatus.SENT,
  ContractStatus.CONFIRMED,
  ContractStatus.FINISHED,
];

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
  return new Set();
}

function getNextPossibleStatuses(s: ContractStatus): ContractStatus[] {
  switch (s) {
    case ContractStatus.CREATED:
      return [ContractStatus.PROPOSED, ContractStatus.SENT];
    case ContractStatus.PROPOSED:
      return [ContractStatus.SENT];
    case ContractStatus.SENT:
      return [ContractStatus.CONFIRMED];
    case ContractStatus.CONFIRMED:
      return [ContractStatus.FINISHED];
  }
  return [];
}

function ContractProgress({ contract, resourceStatus }: Props) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const hasRole = useSelector((state: RootState) => (role: Roles) => authedUserHasRole(state, role));

  const [activityMap, setActivityMap] = useState<StatusDescriptionMap<ContractStatus>>(new Map());
  const [lastStatus, setLastStatus] = useState<ContractStatus>(ContractStatus.CREATED);
  const [completedStatuses, setCompletedStatuses] = useState<Set<ContractStatus>>(new Set());
  const [nextPossibleStatuses, setNextPossibleStatuses] = useState<Set<ContractStatus>>(new Set());

  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  useEffect(() => {
    const newActivityMap = getStatusDescriptionMap(contract.activities);
    setActivityMap(newActivityMap);

    const lastDocumentStatus =
      getLastDocumentStatus([...newActivityMap.keys()], [...ORDERED_CONTRACT_STATUSES, ContractStatus.CANCELLED]) ??
      ContractStatus.CREATED;
    setLastStatus(lastDocumentStatus);

    const newCompletedStatuses = getCompletedStatuses([lastDocumentStatus], getPrerequisiteStatuses);
    setCompletedStatuses(newCompletedStatuses);

    const newNextPossibleStatuses = new Set(getNextPossibleStatuses(lastDocumentStatus));
    setNextPossibleStatuses(newNextPossibleStatuses);
  }, [contract]);

  const authorizedToEdit = (): boolean => {
    return [Roles.GENERAL, Roles.ADMIN].some((r) => hasRole(r));
  };

  const getStatusForActivity = (activity: ContractStatus): FinancialDocumentStepStatus | undefined => {
    if (completedStatuses.has(activity)) return FinancialDocumentStepStatus.COMPLETED;
    if (activityMap.has(ContractStatus.CANCELLED)) return FinancialDocumentStepStatus.CANCELLED;
    if (nextPossibleStatuses.has(activity) && authorizedToEdit()) return FinancialDocumentStepStatus.CREATABLE;
    return undefined;
  };

  const onStatusSave = (documentStatus: ContractStatus, description: string): void => {
    dispatch(createSingleStatus(SingleEntities.Contract, contract.id, { subType: documentStatus, description }));
  };

  const getDescription = (documentStatus: ContractStatus): string | undefined => {
    const descriptions = activityMap.get(documentStatus);
    // Status does not exist, so return undefined. This indicates to the step as well that the status does not exist
    if (!descriptions) return undefined;
    if (i18n.language === 'nl-NL') return descriptions.descriptionDutch;
    return descriptions.descriptionEnglish;
  };

  const getTitle = (): string => {
    if (lastStatus === ContractStatus.CANCELLED) {
      return t('activities.status.header.cancelled', { entity: t('entity.contract') });
    }
    return t('activities.status.header.general', { entity: t('entity.contract') });
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
        <FinancialDocumentStatusModal
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
    <FinancialDocumentProgress resourceStatus={resourceStatus} title={getTitle()} rightButton={cancelButton()}>
      {ORDERED_CONTRACT_STATUSES.map((s) => {
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

export default ContractProgress;
