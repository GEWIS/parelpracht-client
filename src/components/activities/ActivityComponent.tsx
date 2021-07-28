import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Feed, Popup, Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import './Activity.scss';
import { Dispatch } from 'redux';
import { RootState } from '../../stores/store';
import { getUserAvatar } from '../../stores/user/selectors';
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
import { TransientAlert } from '../../stores/alerts/actions';
import { showTransientAlert } from '../../stores/alerts/actionCreators';
import AuthorizationComponent from '../AuthorizationComponent';

interface Props extends RouteComponentProps {
  activity: GeneralActivity;
  componentId: number;
  componentType: SingleEntities;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;

  avatarUrl: string;

  deleteActivitySingle: (entity: SingleEntities, id: number, activityId: number) => void;
  deleteInstanceActivitySingle: (id: number, instanceId: number, activityId: number) => void;
  showTransientAlert: (alert: TransientAlert) => void;
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
    const deleteMessage = `Delete ${activity.type.toLowerCase()}`;
    let deleteButton;

    if (componentType !== 'Invoice' && !(activity.type === ActivityType.STATUS && (activity.subType === ContractStatus.CREATED
      || activity.subType === InvoiceStatus.CREATED
      || activity.subType === ProductInstanceStatus.NOTDELIVERED))) {
      const headerString = 'Are you sure you want to delete this activity?';
      deleteButton = (
        <AuthorizationComponent roles={[Roles.ADMIN]} notFound={false}>
          <Popup
            trigger={(
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a>Delete</a>
          )}
            on="click"
            hideOnScroll
            content={(
              <Button
                color="red"
                onClick={() => this.deleteComment()}
                style={{ marginTop: '0.5em' }}
              >
                {deleteMessage}
              </Button>
          )}
            header={headerString}
          />
        </AuthorizationComponent>
      );
    }

    let feedDescription;
    if (activity.descriptionEnglish === '') {
      feedDescription = undefined;
    } else if (activity.type === ActivityType.COMMENT || activity.type === ActivityType.STATUS) {
      feedDescription = (
        <Feed.Extra><Segment raised>{activity.descriptionEnglish}</Segment></Feed.Extra>);
    } else {
      feedDescription = (<Feed.Extra style={{ fontStyle: 'italic' }}>{activity.descriptionEnglish}</Feed.Extra>);
    }

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
        <Feed.Content style={{ marginBottom: '1em', width: '85%' }}>
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
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActivityComponent));
