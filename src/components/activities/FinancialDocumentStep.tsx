import React from 'react';
import { connect } from 'react-redux';
import { Step, Icon } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../stores/store';
import { GeneralActivity } from './GeneralActivity';
import {
  getStatusActivity,
  statusApplied,
} from '../../helpers/activity';

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
    const statusCompletedActivity: GeneralActivity | null = getStatusActivity(
      allStatusActivities,
      status,
    );
    if (cancelled) {
      if (statusApplied(status, lastStatusActivity)) {
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

    if (statusCompletedActivity == null) {
      if (statusApplied(status, lastStatusActivity)) {
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
