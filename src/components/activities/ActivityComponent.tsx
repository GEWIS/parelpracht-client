import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Feed, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import './Activity.scss';
import { Dispatch } from 'redux';
import { RootState } from '../../stores/store';
import { getUserAvatar, getUserName } from '../../stores/user/selectors';
import { formatActivitySummary } from '../../helpers/activity';
import { GeneralActivity } from './GeneralActivity';
import { formatLastUpdate } from '../../helpers/timestamp';
import { SingleEntities } from '../../stores/single/single';
import { deleteActivitySingle } from '../../stores/single/actionCreators';
import UserLinkWithoutImage from '../user/UserLinkWithoutImage';
import { deleteInstanceActivitySingle } from '../../stores/productinstance/actionCreator';
import {
  ActivityType, ContractStatus, InvoiceStatus, ProductInstanceStatus, Roles,
} from '../../clients/server.generated';
import UserAvatar from '../user/UserAvatar';
import AuthorizationComponent from '../AuthorizationComponent';

interface Props extends RouteComponentProps {
  activity: GeneralActivity;
  componentId: number;
  componentType: SingleEntities;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;

  userName: string;
  avatarUrl: string;
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
    const { activity, avatarUrl, componentType } = this.props;
    const feedLabel = (
      <UserAvatar size="3em" fileName={avatarUrl} clickable={false} />
    );

    const summaryType = formatActivitySummary(activity.type, activity.subType, componentType);
    const summaryUser = (
      <UserLinkWithoutImage id={this.props.activity.createdById} />
    );

    let deleteButton;
    if (!(activity.type === ActivityType.STATUS && (activity.subType === ContractStatus.CREATED
      || activity.subType === InvoiceStatus.CREATED
      || activity.subType === ProductInstanceStatus.NOTDELIVERED))) {
      deleteButton = (
        <>
          <AuthorizationComponent roles={[Roles.ADMIN]} notFound={false}>
            {/* eslint-disable-next-line */}
            <a onClick={() => this.deleteComment()}>
              Delete
            </a>
          </AuthorizationComponent>
        </>
      );
    }

    let feedDescription;
    if (activity.description === '') {
      feedDescription = undefined;
    } else if (activity.type === ActivityType.COMMENT || activity.type === ActivityType.STATUS) {
      feedDescription = (
        <Feed.Extra><Segment raised>{activity.description}</Segment></Feed.Extra>);
    } else {
      feedDescription = (<Feed.Extra style={{ fontStyle: 'italic' }}>{activity.description}</Feed.Extra>);
    }

    // const feedDescription = activity.description !== '' ? (
    //   <Feed.Extra
    //     style={activity.type !== ActivityType.COMMENT ? { fontStyle: 'italic' } : {}}
    //   >
    //     {activity.description}
    //   </Feed.Extra>
    // ) : undefined;

    const feedButtons = deleteButton !== undefined ? (
      <Feed.Meta>
        {deleteButton}
      </Feed.Meta>
    ) : undefined;

    return (
      <Feed.Event>
        <Feed.Label>
          {feedLabel}
        </Feed.Label>
        <Feed.Content style={{ marginBottom: '1em' }}>
          <Feed.Date>
            {formatLastUpdate(activity.createdAt)}
          </Feed.Date>
          <Feed.Summary>
            {summaryType}
            {summaryUser}
          </Feed.Summary>
          {feedDescription}
          {feedButtons}
          {/* <Divider horizontal /> */}
        </Feed.Content>
      </Feed.Event>
    );
  }
}

const mapStateToProps = (state: RootState, props: { activity: GeneralActivity }) => {
  return {
    userName: getUserName(state, props.activity.createdById),
    avatarUrl: getUserAvatar(state, props.activity.createdById),
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
