/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Button, ButtonProps, Grid, Modal, Segment,
} from 'semantic-ui-react';
import { Client } from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import { deleteSingle } from '../../stores/single/actionCreators';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import UserSelector from './UserSelector';

interface Props extends ButtonProps {
  userId: number;
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

  async moveAssignmentsUser(id: number, client: Client) {
    const moveAssignments = client.transfer
  }

  public render() {
    const {
      userId, deleteUser, status, ...rest
    } = this.props;

    const client = new Client();

    const trigger = (
      <Button
        positive
        {...rest}
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
              >
                Move assignments
              </Button>
            </Grid.Row>
          </Grid>
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
};

export default connect(mapStateToProps)(UserMoveAssignmentsButton);
