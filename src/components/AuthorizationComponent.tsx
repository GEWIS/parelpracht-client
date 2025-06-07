import { Component, PropsWithChildren } from 'react';
import { connect } from 'react-redux';
import { Roles } from '../clients/server.generated';
import NoRights from '../pages/NoRights';
import { authedUserHasRole } from '../stores/auth/selectors';
import { RootState } from '../stores/store';

interface Props extends PropsWithChildren {
  roles: Roles[];
  notFound: boolean;
  hasRole: (role: Roles) => boolean;
}

class AuthorizationComponent extends Component<Props> {
  render() {
    const { roles, notFound, hasRole, children } = this.props;

    if (roles.some(hasRole)) {
      return children;
    }

    if (notFound) {
      return <NoRights />;
    }

    return null;
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    hasRole: (role: Roles): boolean => authedUserHasRole(state, role),
  };
};

export default connect(mapStateToProps)(AuthorizationComponent);
