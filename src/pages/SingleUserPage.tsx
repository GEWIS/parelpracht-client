import * as React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Breadcrumb, Container, Grid, Header, Loader, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Roles, User } from '../clients/server.generated';
import { fetchSingle, clearSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import UserProps from '../components/entities/user/UserProps';
import ResourceStatus from '../stores/resourceStatus';
import UserSummary from '../components/entities/user/UserSummary';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import { formatContactName } from '../helpers/contact';
import { TransientAlert } from '../stores/alerts/actions';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import UserMoveAssignmentsButton from '../components/entities/user/UserMoveAssignmentsButton';
import { isProfile } from '../stores/user/selectors';
import UserApiKey from '../components/entities/user/UserApiKey';
import UserBackgroundModal from '../components/files/UserBackgroundModal';
import AuthorizationComponent from '../components/AuthorizationComponent';
import NotFound from './NotFound';
import UserAuthSettings from '../components/entities/user/UserAuthSettings';
import { TitleContext } from '../components/TitleContext';
import { withRouter, WithRouter } from '../WithRouter';

interface Props extends WithTranslation, WithRouter {
  user: User | undefined;
  status: ResourceStatus;
  isProfilePage: boolean;

  fetchUser: (id: number) => void;
  clearUser: () => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

class SingleUserPage extends React.Component<Props> {
  componentDidMount() {
    const { params } = this.props.router;

    this.props.clearUser();
    this.props.fetchUser(Number.parseInt(params.userId, 10));
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    const { status, user, t } = this.props;
    const { navigate } = this.props.router;
    if (user === undefined) {
      document.title = t('entity.user');
    } else {
      document.title = formatContactName(
        user.firstName,
        user.lastNamePreposition,
        user.lastName,
      );
    }

    if (status === ResourceStatus.EMPTY
      && prevProps.status === ResourceStatus.DELETING
    ) {
      navigate('/users');
      this.props.showTransientAlert({
        title: 'Success',
        message: `User ${prevProps.user?.firstName} successfully deleted`,
        type: 'success',
        displayTimeInMs: 3000,
      });
    }
  }

  public render() {
    const {
      user, isProfilePage, status, t,
    } = this.props;

    if (status === ResourceStatus.NOTFOUND) {
      return <NotFound />;
    }

    if (user === undefined) {
      return (
        <Container style={{ paddingTop: '1em' }}>
          <Loader content="Loading" active />
        </Container>
      );
    }

    return (
      <>
        <Segment style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }} vertical basic>
          <Container>
            <Breadcrumb
              icon="right angle"
              sections={[
                { key: 'Users', content: <NavLink to="/users">Users</NavLink> },
                {
                  key: 'User',
                  content: user
                    ? formatContactName(user.firstName, user.lastNamePreposition, user.lastName)
                    : '',
                  active: true,
                },
              ]}
            />
          </Container>
        </Segment>
        <Container style={{ marginTop: '1.25em' }}>
          <UserSummary />
          <Grid columns={2} stackable>
            <Grid.Column>
              {user ? (
                <Segment>
                  <UserProps
                    user={user}
                    canEdit={[Roles.ADMIN]}
                  />
                </Segment>
              ) : <Segment placeholder />}
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <h3>
                  {t('pages.user.responsibilities.header')}
                </h3>
                <p>
                  {t('pages.user.responsibilities.description')}
                </p>
                <UserMoveAssignmentsButton userId={user.id} />
              </Segment>
              {isProfilePage ? (
                <Segment>
                  <Header as="h3">
                    {t('pages.user.apiKey.header')}
                  </Header>
                  <p>
                    {t('pages.user.apiKey.description1')}
                    {' '}
                    <code>Authentication</code>
                    {' '}
                    {t('pages.user.apiKey.description2')}
                    <br />
                    <b>{t('pages.user.apiKey.warning')}</b>
                  </p>
                  <UserApiKey />
                </Segment>
              ) : null}
              {isProfilePage ? (
                <Segment>
                  <Header as="h3">
                    {t('pages.user.background.header')}
                  </Header>
                  <UserBackgroundModal
                    entity={SingleEntities.User}
                    entityId={user.id}
                    entityName={user.firstName}
                    fileName={user.backgroundFilename}
                    fetchEntity={this.props.fetchUser}
                    adminView={false}
                  />
                </Segment>
              ) : (
                <AuthorizationComponent roles={[Roles.ADMIN]} notFound={false}>
                  <Segment>
                    <Header as="h3">
                      {t('pages.user.background.header')}
                    </Header>
                    <UserBackgroundModal
                      entity={SingleEntities.User}
                      entityId={user.id}
                      entityName={user.firstName}
                      fileName={user.backgroundFilename}
                      fetchEntity={this.props.fetchUser}
                      adminView
                    />
                  </Segment>
                </AuthorizationComponent>
              )}
              <AuthorizationComponent roles={[Roles.ADMIN]} notFound={false}>
                <UserAuthSettings user={user} />
              </AuthorizationComponent>
            </Grid.Column>
          </Grid>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    user: getSingle<User>(state, SingleEntities.User).data,
    status: getSingle<User>(state, SingleEntities.User).status,
    isProfilePage: isProfile(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchUser: (id: number) => dispatch(fetchSingle(SingleEntities.User, id)),
  clearUser: () => dispatch(clearSingle(SingleEntities.User)),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

SingleUserPage.contextType = TitleContext;

export default withTranslation()(withRouter(connect(mapStateToProps,
  mapDispatchToProps)(SingleUserPage)));
