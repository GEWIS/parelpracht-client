import React from 'react';
import { connect } from 'react-redux';
import { Step, Icon } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../stores/store';
import { GeneralActivity } from './GeneralActivity';
import {
  formatActivityDate,
  formatStatus,
  getStatusActivity,
  statusApplied,
} from '../../helpers/activity';
import { getUserName } from '../../stores/user/selectors';

interface Props extends RouteComponentProps {
  lastStatusActivity: GeneralActivity;
  status: string;
  userName: string;
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
      lastStatusActivity, status, userName, allStatusActivities, documentType,
    } = this.props;
    const statusCompletedActivity: GeneralActivity | null = getStatusActivity(
      allStatusActivities,
      status,
    );

    if (statusCompletedActivity == null) {
      if (statusApplied(status, lastStatusActivity)) {
        return (
          <Step completed>
            <Step.Content>
              <Step.Title>
                {status}
              </Step.Title>
              <Step.Description>
                Information was not logged.
              </Step.Description>
            </Step.Content>
          </Step>
        );
      }
      return (
        <Step circle>
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
            {formatActivityDate(statusCompletedActivity.createdAt, userName)}
          </Step.Description>
        </Step.Content>
      </Step>
    );
  }
}

const mapStateToProps = (state: RootState, props: { lastStatusActivity: GeneralActivity }) => {
  return {
    userName: getUserName(state, props.lastStatusActivity.createdById),
  };
};

const mapDispatchToProps = () => ({});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FinancialDocumentProgress));
