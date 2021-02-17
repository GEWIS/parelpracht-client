import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Divider, Feed, Icon, Popup,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import './Activity.scss';
import { Dispatch } from 'redux';
import { RootState } from '../../stores/store';
import { getUserName } from '../../stores/user/selectors';
import { formatActivitySummary, formatStatus } from '../../helpers/activity';
import { ActivityType, GeneralActivity } from './GeneralActivity';
import { formatLastUpdate } from '../../helpers/timestamp';
import { SingleEntities } from '../../stores/single/single';
import { deleteActivitySingle } from '../../stores/single/actionCreators';
import UserLinkWithoutImage from '../user/UserLinkWithoutImage';
import { deleteInstanceActivitySingle } from '../../stores/productinstance/actionCreator';
import { ContractStatus, InvoiceStatus, ProductInstanceStatus } from '../../clients/server.generated';
import { TransientAlert } from '../../stores/alerts/actions';
import { showTransientAlert } from '../../stores/alerts/actionCreators';

interface Props extends RouteComponentProps {
  activity: GeneralActivity;
  componentId: number;
  componentType: SingleEntities;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;

  userName: string;
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
    let activitySubtype = `"${formatStatus(this.props.activity.subType?.toLowerCase())}"`;
    if (this.props.activity.subType == null) {
      activitySubtype = `"${this.props.activity.description}"`;
    }
    this.props.showTransientAlert({
      title: 'Success',
      message: `Deleted ${this.props.activity.type.toLowerCase()} ${activitySubtype} successfully.`,
      type: 'success',
    });
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
    const deleteMessage = `Delete ${activity.type.toLowerCase()}`;
    let deleteButton;
    if ((activity.type === ActivityType.STATUS
      && activity.subType !== ContractStatus.CREATED
      && activity.subType !== InvoiceStatus.CREATED
      && activity.subType !== ProductInstanceStatus.NOTDELIVERED)
      || activity.type === ActivityType.COMMENT) {
      const headerString = `Are you sure you want to delete this ${activity.type.toLowerCase()}?`;
      deleteButton = (
        // eslint-disable-next-line
        <Popup
          trigger={(
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a>Delete</a>
          )}
          on="click"
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
      );
    }

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
          <Feed.Meta>
            {deleteButton}
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
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActivityComponent));
