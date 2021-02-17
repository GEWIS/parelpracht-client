/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Button, ButtonProps, Grid, Icon, Modal, Segment,
} from 'semantic-ui-react';
import { Client, TransferUserParams } from '../../clients/server.generated';
import { clearSingle, fetchSingle } from '../../stores/single/actionCreators';
import { SingleEntities } from '../../stores/single/single';
import UserSelector from './UserSelector';

interface Props extends ButtonProps {
  userId: number;
  clearUser: () => void;
  fetchUser: (id: number) => void;
}

interface State {
  isLoading: boolean;
  open: boolean;
  selectedUser: number | undefined;
}

class UserMoveAssignmentsButton extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: false,
      open: false,
      selectedUser: undefined,
    };
  }

  async moveAssignmentsUser() {
    const client = new Client();

    this.setState({ isLoading: true });
    await client.transferAssignments(
      this.props.userId,
      new TransferUserParams({ toUserId: this.state.selectedUser! }),
    );
    this.props.clearUser();
    this.props.fetchUser(this.props.userId);
    this.setState({ isLoading: false });
    this.setState({ open: false });
  }

  public render() {
    const trigger = (
      <Button
        icon
        labelPosition="left"
        floated="right"
        style={{ marginTop: '-0.5em' }}
        primary
      >
        <Icon name="arrow right" />
        Transfer assignments
      </Button>
    );

    return (
      <Modal
        onClose={() => { this.setState({ open: false }); }}
        onOpen={() => { this.setState({ open: true }); }}
        closeIcon
        open={this.state.open}
        dimmer="blurring"
        size="tiny"
        trigger={trigger}
      >
        <Modal.Header>
          Transfer Assignments
          <Button
            icon
            positive
            disabled={this.state.selectedUser === undefined}
            loading={this.state.isLoading}
            onClick={() => this.moveAssignmentsUser()}
            floated="right"
          >
            <Icon name="arrow right" />
            Transfer
          </Button>
          <Button
            icon
            floated="right"
            onClick={() => { this.setState({ open: false }); }}
          >
            Cancel
          </Button>
        </Modal.Header>
        <Modal.Content>
          <UserSelector
            id="user-selector"
            value={this.state.selectedUser}
            onChange={(val: number | '') => this.setState({
              selectedUser: val === '' ? undefined : val,
            })}
            clearable
          />
        </Modal.Content>
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchUser: (id: number) => dispatch(fetchSingle(SingleEntities.User, id)),
  clearUser: () => dispatch(clearSingle(SingleEntities.User)),
});

export default connect(null, mapDispatchToProps)(UserMoveAssignmentsButton);
