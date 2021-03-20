import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb, Container, Grid, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { User } from '../clients/server.generated';
import { fetchSingle, clearSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import UserProps from '../components/user/UserProps';
import ResourceStatus from '../stores/resourceStatus';
import UserSummary from '../components/user/UserSummary';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import { formatContactName } from '../helpers/contact';
import { TransientAlert } from '../stores/alerts/actions';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import UserMoveAssignmentsButton from '../components/user/UserMoveAssignmentsButton';

interface Props extends RouteComponentProps<{ userId: string }> {
  user: User | undefined;
  status: ResourceStatus;

  fetchUser: (id: number) => void;
  clearUser: () => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

class SingleUserPage extends React.Component<Props> {
  componentDidMount() {
    const { userId } = this.props.match.params;

    this.props.clearUser();
    this.props.fetchUser(Number.parseInt(userId, 10));
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.status === ResourceStatus.EMPTY
      && prevProps.status === ResourceStatus.DELETING
    ) {
      this.props.history.push('/company');
      this.props.showTransientAlert({
        title: 'Success',
        message: `User ${prevProps.user?.firstName} successfully deleted`,
        type: 'success',
        displayTimeInMs: 3000,
      });
    }
  }

  public render() {
    const { user } = this.props;

    if (user === undefined) return (<div />);

    return (
      <Container style={{ paddingTop: '2em' }}>
        <Breadcrumb
          icon="right angle"
          sections={[
            { key: 'Users', content: <NavLink to="/user">Users</NavLink> },
            {
              key: 'User',
              content: user
                ? formatContactName(user.firstName, user.lastNamePreposition, user.lastName)
                : '',
              active: true,
            },
          ]}
        />
        <UserSummary />
        <Grid columns={2}>
          <Grid.Column>
            {user ? (
              <Segment>
                <UserProps user={user} />
              </Segment>
            ) : <Segment placeholder />}
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <h2>
                Responsibilities
                <UserMoveAssignmentsButton userId={user.id} />
              </h2>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    user: getSingle<User>(state, SingleEntities.User).data,
    status: getSingle<User>(state, SingleEntities.User).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchUser: (id: number) => dispatch(fetchSingle(SingleEntities.User, id)),
  clearUser: () => dispatch(clearSingle(SingleEntities.User)),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleUserPage));
