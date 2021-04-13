import React from 'react';
import { connect } from 'react-redux';
import { Icon, Step } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { GeneralActivity } from './GeneralActivity';
import {
  formatStatus,
  getCompletedDocumentStatuses,
  getLastStatusNotCancelled,
  getStatusActivity,
  getStatusesFromActivities,
  getToDoStatus,
} from '../../helpers/activity';
import DocumentStatusModal from './DocumentStatusModal';
import { SingleEntities } from '../../stores/single/single';
import { DocumentStatus } from './DocumentStatus';
import ResourceStatus from '../../stores/resourceStatus';
import { TransientAlert } from '../../stores/alerts/actions';
import { showTransientAlert } from '../../stores/alerts/actionCreators';
import { Roles } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { authedUserHasRole } from '../../stores/auth/selectors';

/**
 * Definition of used variables
 */
interface Props extends RouteComponentProps {
  documentId: number;
  documentType: SingleEntities;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;

  allStatusActivities: GeneralActivity[];

  status: DocumentStatus;
  cancelled: boolean;

  resourceStatus: ResourceStatus;
  showTransientAlert: (alert: TransientAlert) => void;

  hasRole: (role: Roles) => boolean;

  roles: Roles[];
}

interface State {
  stepModalOpen: boolean;
}

class FinancialDocumentProgress extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      stepModalOpen: false,
    };
  }

  closeStepModal = () => {
    this.setState({
      stepModalOpen: false,
    });
  };

  public render() {
    const {
      documentId,
      cancelled,
      allStatusActivities,
      documentType,
      status,
      resourceStatus,
      parentId,
      hasRole,
      roles,
    } = this.props;
    const { stepModalOpen } = this.state;
    const completedStatuses = getStatusesFromActivities(allStatusActivities);
    const lastActiveStatus = getLastStatusNotCancelled(completedStatuses);
    const realLastStatus = completedStatuses[completedStatuses.length - 1];
    const allCompletedStatuses = getCompletedDocumentStatuses(lastActiveStatus, documentType);

    /**
     * Activity with the status update that has been last been completed last.
     * Null if not completed.
     */
    const statusCompletedActivity: GeneralActivity | undefined = getStatusActivity(
      allStatusActivities,
      status,
    );
    const nextActiveStatus = lastActiveStatus === undefined
      ? [DocumentStatus.CREATED] : getToDoStatus(lastActiveStatus, documentType);

    const title = formatStatus(status);
    const description = statusCompletedActivity?.description;
    const completedStatus = allCompletedStatuses.includes(status);

    let disabledStep = false;
    let clickableString = '';
    let onStepClick;
    const permissionToClick = roles.some(hasRole);
    if (nextActiveStatus.includes(status)) {
      clickableString = 'clickable';
      onStepClick = () => {
        this.setState({
          stepModalOpen: true,
        });
      };
    }
    let stepIcon = <Icon />;
    if (realLastStatus === DocumentStatus.DEFERRED) {
      stepIcon = <Icon color="orange" name="stopwatch" />;
      disabledStep = true;
    } else if (realLastStatus === DocumentStatus.CANCELLED
      || realLastStatus === DocumentStatus.IRRECOVERABLE) {
      stepIcon = <Icon color="red" name="close" />;
      disabledStep = true;
    }
    console.log(status, realLastStatus);

    return (
      <>
        <Step
          completed={completedStatus}
          className={clickableString}
          onClick={onStepClick}
          disabled={!permissionToClick || disabledStep}
        >
          {stepIcon}
          <Step.Content>
            <Step.Title>
              {title}
            </Step.Title>
            <Step.Description>
              {description}
            </Step.Description>
          </Step.Content>
        </Step>
        <DocumentStatusModal
          open={stepModalOpen}
          documentId={documentId}
          parentId={parentId}
          documentType={documentType}
          documentStatus={status}
          close={this.closeStepModal}
          resourceStatus={resourceStatus}
        />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

const mapStateToProps = (state: RootState) => {
  return {
    hasRole: (role: Roles): boolean => authedUserHasRole(state, role),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FinancialDocumentProgress));
