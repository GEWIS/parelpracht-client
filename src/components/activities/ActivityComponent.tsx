import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Feed, Icon, Label } from 'semantic-ui-react';
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
    const { activity, userName } = this.props;
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

    return (
      <Feed.Event>
        <Feed.Label>
          {feedLabel}
          {/* <Label circular size="big"> */}
          {/*  {formatUserNameInitials(userName)} */}
          {/* </Label> */}
        </Feed.Label>
        <Feed.Content>
          <Feed.Date>
            {formatLastUpdate(activity.createdAt)}
          </Feed.Date>
          <Feed.Summary>
            {formatActivitySummary(userName, activity.type, activity.subType)}
          </Feed.Summary>
          <Feed.Extra>
            {activity.description}
          </Feed.Extra>
          <Feed.Meta onClick={() => this.deleteComment()}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>Delete</a>
          </Feed.Meta>
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
