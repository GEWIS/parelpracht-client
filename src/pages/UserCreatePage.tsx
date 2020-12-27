import * as React from 'react';
import {
  Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Gender, User } from '../clients/server.generated';
import { RootState } from '../stores/store';
import UserProps from '../components/user/UserProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { SingleEntities } from '../stores/single/single';
import { getSingle } from '../stores/single/selectors';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';

interface Props extends RouteComponentProps {
  status: ResourceStatus;

  clearUser: () => void;
}

class UserCreatePage extends React.Component<Props> {
  componentDidMount() {
    this.props.clearUser();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      this.close();
    }
  }

  close = () => { this.props.history.push('/user'); };

  public render() {
    const user: User = {
      id: 0,
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      gender: Gender.UNKNOWN,
      comment: '',
    } as User;

    return (
      <Modal
        onClose={this.close}
        open
        dimmer="blurring"
        closeOnDimmerClick={false}
        size="tiny"
      >
        <Segment>
          <AlertContainer />
          <UserProps user={user} create onCancel={this.close} />
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<User>(state, SingleEntities.User).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchUser: (id: number) => dispatch(fetchSingle(SingleEntities.User, id)),
  clearUser: () => dispatch(clearSingle(SingleEntities.User)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserCreatePage));
