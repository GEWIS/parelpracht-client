import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Feed, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import './Activity.scss';
import { RootState } from '../../stores/store';
import { getUserName } from '../../stores/user/selectors';
import { formatActivitySummary } from '../../helpers/activity';
import { ActivityType, GeneralActivity } from './GeneralActivity';
import { formatLastUpdate } from '../../helpers/timestamp';

interface Props extends RouteComponentProps {
  activity: GeneralActivity;

  userName: string;
}

class ActivityComponent extends React.Component<Props> {
  public render() {
    const { activity, userName } = this.props;
    let icon;
    if (activity.type === ActivityType.COMMENT) {
      icon = (
        <Icon name="pencil" />
      );
    } else {
      icon = (
        <Icon name="checkmark" />
      );
    }

    return (
      <Feed.Event>
        <Feed.Label>
          {icon}
        </Feed.Label>
        <Feed.Content>
          <Feed.Date>
            {formatLastUpdate(activity.createdAt)}
          </Feed.Date>
          <Feed.Summary>
            {formatActivitySummary(userName, activity.type, activity.subType)}
          </Feed.Summary>
          <Feed.Extra text>
            {activity.description}
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
    );
  }
}

const mapStateToProps = (state: RootState, props: { activity: GeneralActivity }) => {
  return {
    userName: getUserName(state, props.activity.createdById),
  };
};

export default withRouter(connect(mapStateToProps)(ActivityComponent));
