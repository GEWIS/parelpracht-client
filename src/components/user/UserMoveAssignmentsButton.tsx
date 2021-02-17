/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Button, ButtonProps, Grid, Modal, Segment,
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
        positive
        floated="right"
      >
        Move assignments
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
        <Segment attached="bottom">
          <Grid>
            <Grid.Row>
              <UserSelector
                id="user-selector"
                value={this.state.selectedUser}
                onChange={(val: number | '') => this.setState({
                  selectedUser: val === '' ? undefined : val,
                })}
                clearable
              />
            </Grid.Row>
            <Grid.Row>
              <Button
                positive
                disabled={this.state.selectedUser === undefined}
                loading={this.state.isLoading}
                onClick={() => this.moveAssignmentsUser()}
              >
                Transfer assignments
              </Button>
            </Grid.Row>
          </Grid>
        </Segment>
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchUser: (id: number) => dispatch(fetchSingle(SingleEntities.User, id)),
  clearUser: () => dispatch(clearSingle(SingleEntities.User)),
});

export default connect(null, mapDispatchToProps)(UserMoveAssignmentsButton);
