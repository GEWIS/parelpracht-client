import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import validator from 'validator';
import ResourceStatus from '../../stores/resourceStatus';
import { SingleEntities } from '../../stores/single/single';
import { createSingleComment } from '../../stores/single/actionCreators';
import { ActivityParams } from '../../clients/server.generated';
import { createInstanceCommentSingle } from '../../stores/productinstance/actionCreator';
import { TransientAlert } from '../../stores/alerts/actions';
import { showTransientAlert } from '../../stores/alerts/actionCreators';

interface Props {
  create: boolean;
  resourceStatus: ResourceStatus;
  componentId: number;
  componentType: SingleEntities;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;

  close: () => void;
  createSingleComment: (entity: SingleEntities, id: number, comment: object) => void;
  createSingleInstanceComment: (id: number, instanceId: number, comment: object) => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

interface State {
  editing: boolean;
  comment: string;
}

class DocumentStatusProps extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      editing: props.create ?? false,
      comment: '',
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resourceStatus === ResourceStatus.SAVING
      && this.props.resourceStatus === ResourceStatus.FETCHED) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ editing: false });
    }
  }

  edit = () => {
    this.setState({ editing: true });
  };

  cancel = () => {
    if (!this.props.create) {
      this.setState({ editing: false });
    }
    this.props.close();
  };

  toComponentParams = () => {
    return new ActivityParams({
      description: this.state.comment,
    });
  };

  addComment = () => {
    if (this.props.componentType === SingleEntities.ProductInstance) {
      this.props.createSingleInstanceComment(
        this.props.parentId!,
        this.props.componentId,
        this.toComponentParams(),
      );
    } else {
      this.props.createSingleComment(
        this.props.componentType,
        this.props.componentId,
        this.toComponentParams(),
      );
    }
    this.props.showTransientAlert({
      title: 'Success',
      message: `Posted comment "${this.state.comment}" successfully.`,
      type: 'success',
    });
    this.cancel();
  };

  render() {
    const { editing, comment } = this.state;
    return (
      <>
        <h4>
          {this.props.create ? 'Post Comment' : 'Comment Details'}
        </h4>

        <Button
          floated="right"
          icon="save"
          positive
          onClick={() => this.addComment()}
          disabled={validator.isEmpty(comment)}
        />
        <Button
          floated="right"
          icon="close"
          negative
          onClick={() => this.cancel()}
        />

        <Input
          fluid
          id="form-input-comment"
          placeholder="Comment"
          onChange={(e) => this.setState({ comment: e.target.value })}
          error={validator.isEmpty(comment)}
        />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createSingleComment: (entity: SingleEntities, id: number, comment: object) => dispatch(
    createSingleComment(entity, id, comment),
  ),
  createSingleInstanceComment: (id: number, instanceId: number, comment: object) => dispatch(
    createInstanceCommentSingle(id, instanceId, comment),
  ),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default connect(null, mapDispatchToProps)(DocumentStatusProps);
