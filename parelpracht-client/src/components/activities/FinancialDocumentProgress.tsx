import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { Grid, GridColumn, GridRow, Segment, StepGroup } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ResourceStatus from '../../stores/resourceStatus';
import {
  DocumentStatus,
  formatTranslateStatus,
  getCompletedStatuses,
  getLastDocumentStatus,
  getStatusDescriptionMap,
  StatusDescriptionMap,
} from '../../helpers/activity';
import { ContractActivity, InvoiceActivity, ProductInstanceActivity, Roles } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { authedUserHasRole } from '../../stores/auth/selectors';
import FinancialDocumentStep, { FinancialDocumentStepStatus } from './FinancialDocumentStep';

interface Props<T extends ContractActivity | InvoiceActivity | ProductInstanceActivity> extends PropsWithChildren {
  leftButton?: ReactNode;
  rightButton?: ReactNode;
  resourceStatus: ResourceStatus;
  /**
   * The formatted (translated) name of the entity this progress stepper belongs to.
   */
  formattedEntityName: string;
  activities: T[];
  /**
   * The statuses that should be shown as steps. Defaults to all ordered statuses.
   */
  statusesToShow?: DocumentStatus<T>[];
  /**
   * All statuses the entity can have, ordered from earliest (CREATED) to last (FINISHED/CANCELLED)
   */
  orderedStatuses: DocumentStatus<T>[];
  /**
   * The first, initial status of the entity
   */
  initialStatus: DocumentStatus<T>;
  /**
   * The status the entity should have to be marked as cancelled (red X'es)
   */
  cancelledStatus?: DocumentStatus<T>;
  /**
   * The status the entity should have to be marked as deferred (orange stopwatches)
   */
  deferredStatus?: DocumentStatus<T>;

  getPrerequisiteStatuses: (s: DocumentStatus<T>) => Set<DocumentStatus<T>>;
  getNextPossibleStatuses: (s: DocumentStatus<T>) => Set<DocumentStatus<T>>;
  onStatusSave: (s: DocumentStatus<T>, description: string) => void;

  /**
   * List of roles that are allowed to update the document status
   */
  roles: Roles[];
}

function FinancialDocumentProgress<T extends ContractActivity | InvoiceActivity | ProductInstanceActivity>({
  leftButton = undefined,
  rightButton = undefined,
  resourceStatus,
  formattedEntityName,
  activities,
  orderedStatuses,
  statusesToShow = orderedStatuses,
  initialStatus,
  cancelledStatus = undefined,
  deferredStatus = undefined,
  getPrerequisiteStatuses,
  getNextPossibleStatuses,
  onStatusSave,
  roles,
}: Props<T>) {
  const { t, i18n } = useTranslation();
  const hasRole = useSelector((state: RootState) => (role: Roles) => authedUserHasRole(state, role));

  const [activityMap, setActivityMap] = useState<StatusDescriptionMap<T>>(getStatusDescriptionMap(activities));
  const [lastStatus, setLastStatus] = useState<DocumentStatus<T>>(initialStatus);
  const [completedStatuses, setCompletedStatuses] = useState<Set<DocumentStatus<T>>>(new Set());
  const [nextPossibleStatuses, setNextPossibleStatuses] = useState<Set<DocumentStatus<T>>>(new Set());

  useEffect(() => {
    const newActivityMap = getStatusDescriptionMap(activities);
    setActivityMap(newActivityMap);

    const lastDocumentStatus = getLastDocumentStatus([...newActivityMap.keys()], orderedStatuses) ?? initialStatus;
    setLastStatus(lastDocumentStatus);

    const newCompletedStatuses = getCompletedStatuses([lastDocumentStatus], getPrerequisiteStatuses);
    setCompletedStatuses(newCompletedStatuses);

    const newNextPossibleStatuses = getNextPossibleStatuses(lastDocumentStatus);
    setNextPossibleStatuses(newNextPossibleStatuses);
  }, [activities, getNextPossibleStatuses, getPrerequisiteStatuses, initialStatus, orderedStatuses]);

  const getDescription = (documentStatus: DocumentStatus<T>): string | undefined => {
    const descriptions = activityMap.get(documentStatus);
    // Status does not exist, so return undefined. This indicates to the step as well that the status does not exist
    if (!descriptions) return undefined;
    if (i18n.language === 'nl-NL') return descriptions.descriptionDutch;
    return descriptions.descriptionEnglish;
  };

  const authorizedToEdit = (): boolean => {
    return roles.some((r) => hasRole(r));
  };

  const getStatusForActivity = (activity: DocumentStatus<T>): FinancialDocumentStepStatus | undefined => {
    if (deferredStatus && completedStatuses.has(deferredStatus)) return FinancialDocumentStepStatus.DEFERRED;
    if (completedStatuses.has(activity)) return FinancialDocumentStepStatus.COMPLETED;
    if (cancelledStatus && activityMap.has(cancelledStatus)) return FinancialDocumentStepStatus.CANCELLED;
    if (nextPossibleStatuses.has(activity) && authorizedToEdit()) return FinancialDocumentStepStatus.CREATABLE;
    return undefined;
  };

  const getTitle = (): string => {
    if (lastStatus === cancelledStatus) {
      return t('activities.status.header.cancelled', { entity: formattedEntityName });
    }
    if (lastStatus === deferredStatus) {
      return t('activities.status.header.deferred', { entity: formattedEntityName });
    }
    return t('activities.status.header.general', { entity: formattedEntityName });
  };

  return (
    <Segment
      secondary
      style={{ backgroundColor: 'rgba(243, 244, 245, 0.98)' }}
      loading={[ResourceStatus.FETCHING, ResourceStatus.SAVING, ResourceStatus.DELETING].includes(resourceStatus)}
    >
      <Grid columns={3}>
        <GridRow>
          <GridColumn verticalAlign="middle">{leftButton}</GridColumn>
          <GridColumn verticalAlign="middle">
            <h3 style={{ textAlign: 'center' }}>{getTitle()}</h3>
          </GridColumn>
          <GridColumn verticalAlign="middle">{rightButton}</GridColumn>
        </GridRow>
      </Grid>
      <StepGroup fluid widths={5}>
        {statusesToShow.map((s) => (
          <FinancialDocumentStep
            key={s}
            title={formatTranslateStatus(s)}
            stepStatus={getStatusForActivity(s)}
            documentStatus={s}
            description={getDescription(s)}
            resourceStatus={resourceStatus}
            onSave={onStatusSave}
          />
        ))}
      </StepGroup>
    </Segment>
  );
}

export default FinancialDocumentProgress;
