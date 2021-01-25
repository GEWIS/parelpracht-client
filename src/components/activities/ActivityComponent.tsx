import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Divider, Feed, Icon, Label,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import './Activity.scss';
import { Dispatch } from 'redux';
import { RootState } from '../../stores/store';
import { getUserName } from '../../stores/user/selectors';
import { formatActivitySummary, formatUserNameInitials } from '../../helpers/activity';
import { ActivityType, GeneralActivity } from './GeneralActivity';
import { formatLastUpdate } from '../../helpers/timestamp';
import { SingleEntities } from '../../stores/single/single';
import { deleteActivitySingle } from '../../stores/single/actionCreators';
import UserLinkWithoutImage from '../user/UserLinkWithoutImage';

interface Props extends RouteComponentProps {
  activity: GeneralActivity;
  componentId: number;
  componentType: SingleEntities;

  userName: string;
  deleteActivitySingle: (entity: SingleEntities, id: number, activityId: number) => void;
}

class ActivityComponent extends React.Component<Props> {
  deleteComment = () => {
    this.props.deleteActivitySingle(
      this.props.componentType,
      this.props.componentId,
      this.props.activity.id,
    );
  };

  public render() {
    const { activity } = this.props;
    let feedLabel;
    if (activity.type === ActivityType.COMMENT) {
      feedLabel = (
        <Icon name="pencil" />
      );
    } else {
      feedLabel = (
        <Icon name="checkmark" />
      );
    }

    const summaryType: string = formatActivitySummary(activity.type, activity.subType);
    const summaryUser = (
      <UserLinkWithoutImage id={this.props.activity.createdById} />
    );

    return (
      <Feed.Event>
        <Feed.Label>
          {feedLabel}
        </Feed.Label>
        <Feed.Content>
          <Feed.Date>
            {formatLastUpdate(activity.createdAt)}
          </Feed.Date>
          <Feed.Summary>
            {summaryType}
            {summaryUser}
          </Feed.Summary>
          <Feed.Extra>
            {activity.description}
          </Feed.Extra>
          <Feed.Meta onClick={() => this.deleteComment()}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>Delete</a>
          </Feed.Meta>
          <Divider horizontal />
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  deleteActivitySingle: (entity: SingleEntities, id: number, activityId: number) => dispatch(
    deleteActivitySingle(entity, id, activityId),
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActivityComponent));
