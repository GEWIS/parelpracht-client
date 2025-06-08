import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button, ButtonProps, Icon, Modal } from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Client, Roles, TransferUserParams } from '../../../clients/server.generated';
import { clearSingle, fetchSingle } from '../../../stores/single/actionCreators';
import { SingleEntities } from '../../../stores/single/single';
import UserSelector from './UserSelector';

interface Props extends ButtonProps, WithTranslation {
  userId: number;
  clearUser: () => void;
  fetchUser: (id: number) => void;
}

interface State {
  isLoading: boolean;
  open: boolean;
  selectedUser: number | undefined;
}

class UserMoveAssignmentsButton extends Component<Props, State> {
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
    await client.transferAssignments(this.props.userId, new TransferUserParams({ toUserId: this.state.selectedUser! }));
    this.props.clearUser();
    this.props.fetchUser(this.props.userId);
    this.setState({ isLoading: false });
    this.setState({ open: false });
  }

  public render() {
    const { t } = this.props;
    const trigger = (
      <Button>
        <Icon name="arrow up" /> {t('pages.user.responsibilities.transferButton')}
      </Button>
    );

    return (
      <Modal
        onClose={() => {
          this.setState({ open: false });
        }}
        onOpen={() => {
          this.setState({ open: true });
        }}
        closeIcon
        open={this.state.open}
        dimmer="blurring"
        size="tiny"
        trigger={trigger}
      >
        <Modal.Header>
          {t('pages.user.responsibilities.transferButton')}
          <Button
            icon
            positive
            disabled={this.state.selectedUser === undefined}
            loading={this.state.isLoading}
            onClick={() => {
              this.moveAssignmentsUser().catch(console.error);
            }}
            floated="right"
          >
            <Icon name="arrow right" />
            {t('pages.user.responsibilities.transfer')}
          </Button>
          <Button
            icon
            floated="right"
            onClick={() => {
              this.setState({ open: false });
            }}
          >
            {t('pages.user.responsibilities.cancel')}
          </Button>
        </Modal.Header>
        <Modal.Content>
          <UserSelector
            id="user-selector"
            value={this.state.selectedUser}
            onChange={(val: number | '') =>
              this.setState({
                selectedUser: val === '' ? undefined : val,
              })
            }
            clearable
            role={Roles.GENERAL}
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

export default withTranslation()(connect(null, mapDispatchToProps)(UserMoveAssignmentsButton));
