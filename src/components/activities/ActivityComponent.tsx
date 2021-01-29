import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Divider, Feed, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import './Activity.scss';
import { Dispatch } from 'redux';
import { RootState } from '../../stores/store';
import { getUserName } from '../../stores/user/selectors';
import { formatActivitySummary } from '../../helpers/activity';
import { ActivityType, GeneralActivity } from './GeneralActivity';
import { formatLastUpdate } from '../../helpers/timestamp';
import { SingleEntities } from '../../stores/single/single';
import { deleteActivitySingle } from '../../stores/single/actionCreators';
import UserLinkWithoutImage from '../user/UserLinkWithoutImage';
import { deleteInstanceActivitySingle } from '../../stores/productinstance/actionCreator';

interface Props extends RouteComponentProps {
  activity: GeneralActivity;
  componentId: number;
  componentType: SingleEntities;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;

  userName: string;
  deleteActivitySingle: (entity: SingleEntities, id: number, activityId: number) => void;
  deleteInstanceActivitySingle: (id: number, instanceId: number, activityId: number) => void;
}

class ActivityComponent extends React.Component<Props> {
  deleteComment = () => {
    if (this.props.componentType === SingleEntities.ProductInstance) {
      this.props.deleteInstanceActivitySingle(
        this.props.parentId!,
        this.props.componentId,
        this.props.activity.id,
      );
    } else {
      this.props.deleteActivitySingle(
        this.props.componentType,
        this.props.componentId,
        this.props.activity.id,
      );
    }
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
  deleteInstanceActivitySingle: (id: number, instanceId: number, activityId: number) => dispatch(
    deleteInstanceActivitySingle(id, instanceId, activityId),
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActivityComponent));
