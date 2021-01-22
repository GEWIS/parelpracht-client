import React from 'react';
import { connect } from 'react-redux';
import { Step, Icon, Button } from 'semantic-ui-react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../stores/store';
import { GeneralActivity } from './GeneralActivity';
import {
  formatStatus, getCompletedDocumentStatuses, getNextStatus,
  getStatusActivity,
  statusApplied,
} from '../../helpers/activity';
import DocumentStatusModal from './DocumentStatusModal';
import { SingleEntities } from '../../stores/single/single';
import { DocumentStatus } from './DocumentStatus';

/**
 * Definition of used variables
 */
interface Props extends RouteComponentProps {
  documentId: number;
  lastStatusActivity: GeneralActivity;
  status: DocumentStatus;
  cancelled: boolean;
  allStatusActivities: GeneralActivity[];
  documentType: SingleEntities;
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
      lastStatusActivity,
      status,
      cancelled,
      allStatusActivities,
      documentType,
    } = this.props;
    const { stepModalOpen } = this.state;

    /**
     * Activity with the status update that has been last been completed last.
     * Null if not completed.
     */
    const statusCompletedActivity: GeneralActivity | null = getStatusActivity(
      allStatusActivities,
      status,
    );
    const nextStatus: string[] = getNextStatus(lastStatusActivity, documentType);

    // check if the document has been cancelled
    if (cancelled) {
      // if it has been cancelled, then we check if the status has been completed
      if (statusApplied(status, lastStatusActivity, documentType)) {
        // if the status has been completed
        if (statusCompletedActivity != null) {
          return (
            <Step completed disabled>
              <Icon />
              <Step.Content>
                <Step.Title>
                  {formatStatus(status)}
                </Step.Title>
                <Step.Description>
                  {statusCompletedActivity.description}
                </Step.Description>
              </Step.Content>
            </Step>
          );
        }

        // if the status has been completed but it was not logged
        if (getCompletedDocumentStatuses(
          lastStatusActivity.subType,
          documentType,
        ).includes(status)) {
          return (
            <Step completed disabled>
              <Icon />
              <Step.Content>
                <Step.Title>
                  {formatStatus(status)}
                </Step.Title>
                <Step.Description>
                  Not logged.
                </Step.Description>
              </Step.Content>
            </Step>
          );
        }
      }

      // if the status has not been completed and cancelled
      return (
        <Step disabled>
          <Icon color="red" name="close" />
          <Step.Content>
            <Step.Title>
              {formatStatus(status)}
            </Step.Title>
            <Step.Description>
              {documentType}
              &nbsp;cancelled.
            </Step.Description>
          </Step.Content>
        </Step>
      );
    }

    // the document has not been cancelled and the status updated is not logged
    if (statusCompletedActivity == null) {
      // the logging of this status has not been put in the CRM system
      if (statusApplied(status, lastStatusActivity, documentType)) {
        return (
          <Step completed>
            <Icon />
            <Step.Content>
              <Step.Title>
                {formatStatus(status)}
              </Step.Title>
              <Step.Description>
                Not logged.
              </Step.Description>
            </Step.Content>
          </Step>
        );
      }

      // the invoice is irrecoverable
      if (lastStatusActivity.subType === DocumentStatus.IRRECOVERABLE) {
        return (
          <Step disabled>
            <Icon color="red" name="close" />
            <Step.Content>
              <Step.Title>
                {formatStatus(lastStatusActivity.subType)}
              </Step.Title>
              <Step.Description>
                {lastStatusActivity.description}
              </Step.Description>
            </Step.Content>
          </Step>
        );
      }

      // the status of the document has not been reached yet and can be completed
      if (nextStatus.includes(status)) {
        return (
          <>
            <Step
              className="clickable"
              onClick={() => {
                this.setState({
                  stepModalOpen: true,
                });
              }}
            >
              <Step.Content>
                <Step.Title>
                  {formatStatus(status)}
                </Step.Title>
              </Step.Content>
            </Step>
            <DocumentStatusModal
              open={stepModalOpen}
              documentId={documentId}
              documentType={documentType}
              documentStatus={status}
              close={this.closeStepModal}
            />
          </>
        );
      }

      // the status of the document has not been reached yet and cannot be completed yet
      return (
        <Step>
          <Step.Content>
            <Step.Title>
              {formatStatus(status)}
            </Step.Title>
            <Step.Description>
              {documentType}
              &nbsp;has yet to be &nbsp;
              {status.toLowerCase()}
              .
            </Step.Description>
          </Step.Content>
        </Step>
      );
    }

    // the status has been completed and logged.
    return (
      <Step completed>
        <Icon />
        <Step.Content>
          <Step.Title>
            {formatStatus(status)}
          </Step.Title>
          <Step.Description>
            {statusCompletedActivity.description}
          </Step.Description>
        </Step.Content>
      </Step>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
  };
};

const mapDispatchToProps = () => ({});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FinancialDocumentProgress));
