import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import {
  Dropdown, Icon, Loader, Menu, Flag,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { AuthStatus, Roles, User } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import { authLogout } from '../../stores/auth/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import UserAvatar from '../entities/user/UserAvatar';
import { authedUserHasRole } from '../../stores/auth/selectors';
import { changeLanguage } from '../../localization';

interface Props extends RouteComponentProps {
  authStatus: AuthStatus | undefined;
  status: ResourceStatus;

  profile: User | undefined;
  profileStatus: ResourceStatus;
  hasRole: (role: Roles) => boolean;

  logout: () => void;
}

function AuthMenu(props: Props) {
  if (props.status !== ResourceStatus.FETCHED || props.authStatus === undefined
    || props.profileStatus !== ResourceStatus.FETCHED || props.profile === undefined) {
    return (
      <Menu.Item position="right" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
        <Loader inline active size="small" style={{ marginLeft: '3em', marginRight: '3em' }} />
      </Menu.Item>
    );
  }

  const { t } = useTranslation();

  const logout = () => {
    props.history.push('/login');
    props.logout();
  };

  const name = formatContactName(
    props.profile.firstName,
    props.profile.lastNamePreposition,
    props.profile.lastName,
  );

  const isAdmin = props.hasRole(Roles.ADMIN);

  return (
    <Menu.Menu position="right">
      <Dropdown
        trigger={(
          <>
            <UserAvatar
              fileName={props.profile.avatarFilename}
              size="1.8em"
              clickable={false}
              imageCss={{ margin: '-0.4em 1em -0.4em -0.4em' }}
              iconCss={{ marginRight: '1em', marginBottom: '-0.125em' }}
            />
            {name}
          </>
        ) as any}
        item
        className="icon"
      >
        <Dropdown.Menu>
          <Dropdown.Item as={NavLink} to={`/user/${props.profile.id}`}>
            <Icon name="user circle" />
            {t('mainMenu.myProfile')}
          </Dropdown.Item>
          {isAdmin ? (
            <Dropdown.Item as={NavLink} to="/user">
              <Icon name="users" />
              {t('mainMenu.users')}
            </Dropdown.Item>
          ) : undefined}
          <Dropdown.Item onClick={logout}>
            <Icon name="sign-out" />
            {t('mainMenu.logout')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown
        trigger={(<Icon name="globe" />)}
        item
        className="icon"
      >
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => changeLanguage('en_US')}
          >
            <Flag name="us" />
            English
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => changeLanguage('nl_NL')}
          >
            <Flag name="nl" />
            Nederlands
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    authStatus: state.auth.authStatus,
    status: state.auth.status,
    profile: state.auth.profile,
    profileStatus: state.auth.profileStatus,
    hasRole: (role: Roles): boolean => authedUserHasRole(state, role),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout: () => dispatch(authLogout()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthMenu));
