import React from 'react';
import { connect } from 'react-redux';
import { Step, Icon } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../stores/store';
import { GeneralActivity } from './GeneralActivity';
import {
  formatStatus,
  getStatusActivity,
  statusApplied,
} from '../../helpers/activity';

/**
 * Definition of used variables
 */
interface Props extends RouteComponentProps {
  lastStatusActivity: GeneralActivity;
  status: string;
  cancelled: boolean;
  allStatusActivities: GeneralActivity[];
  documentType: string;
}

interface State {

}

class FinancialDocumentProgress extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const {
      lastStatusActivity, status, cancelled, allStatusActivities, documentType,
    } = this.props;

    /**
     * Activity with the status update that has been last been completed last.
     * Null if not completed.
     */
    const statusCompletedActivity: GeneralActivity | null = getStatusActivity(
      allStatusActivities,
      status,
    );
    // check if the document has been cancelled
    if (cancelled) {
      // if it has been cancelled, then we check if the status has been completed
      if (statusApplied(status, lastStatusActivity, documentType)) {
        // if the status has been completed
        if (statusCompletedActivity != null) {
          return (
            <Step completed disabled>
              <Step.Content>
                <Step.Title>
                  {status}
                </Step.Title>
                <Step.Description>
                  {statusCompletedActivity.description}
                </Step.Description>
              </Step.Content>
            </Step>
          );
        }
        // if the status has been completed but it was not logged
        if (statusCompletedActivity != null) {
          return (
            <Step completed disabled>
              <Step.Content>
                <Step.Title>
                  {status}
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
              {status}
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
            <Step.Content>
              <Step.Title>
                {status}
              </Step.Title>
              <Step.Description>
                Not logged.
              </Step.Description>
            </Step.Content>
          </Step>
        );
      }
      console.log(lastStatusActivity.subType);
      if (lastStatusActivity.subType === 'IRRECOVERABLE') {
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
      // the status of the document has not been reached yet
      return (
        <Step>
          <Step.Content>
            <Step.Title>
              {status}
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
        <Step.Content>
          <Step.Title>
            {status}
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
