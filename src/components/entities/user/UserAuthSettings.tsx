import { Component } from "react";
import { withTranslation, WithTranslation } from 'react-i18next';
import { Header, Label, Segment } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import ConfirmationDialog from '../../ConfirmationDialog';
import {
  Client, LdapIdentityParams, User,
} from '../../../clients/server.generated';
import ConfirmationDialogWithParameter from '../../tablefilters/ConfirmDialogWithParameter';
import { fetchSingle } from '../../../stores/single/actionCreators';
import { SingleEntities } from '../../../stores/single/single';

interface Props extends WithTranslation {
  fetchUser: (id: number) => void;
  user: User,
}

class UserAuthSettings extends Component<Props, null> {
  constructor(props: Props) {
    super(props);
  }

  createLocalIdentity = async () => {
    const { fetchUser, user } = this.props;
    await new Client().createLocalIdentity(user.id);
    fetchUser(user.id);
  };

  removeLocalIdentity = async () => {
    const { fetchUser, user } = this.props;
    await new Client().deleteLocalIdentity(user.id);
    fetchUser(user.id);
  };

  createLdapIdentity = async (username?: string) => {
    const { fetchUser, user } = this.props;
    await new Client().createLdapIdentity(user.id, new LdapIdentityParams({ username: username! }));
    fetchUser(user.id);
  };

  updateLdapIdentity = async (username?: string) => {
    const { fetchUser, user } = this.props;
    await new Client().updateLdapIdentity(user.id, new LdapIdentityParams({ username: username! }));
    fetchUser(user.id);
  };

  removeLdapIdentity = async () => {
    const { fetchUser, user } = this.props;
    await new Client().deleteLdapIdentity(user.id);
    fetchUser(user.id);
  };

  render() {
    const { user, t } = this.props;
    return (
      <Segment>
        <Header as="h3">
          {t('entities.user.auth.segmentHeader')}
        </Header>
        <div style={{ marginBottom: '0.5rem' }}>
          <Label color={user.identityLocal ? 'green' : 'red'}>{t('entities.user.auth.loginLocal')}</Label>
          <Label color={user.identityLdap ? 'green' : 'red'}>{t('entities.user.auth.loginLdap')}</Label>
        </div>
        <p>
          <b>
            {t('entities.user.auth.segmentDescription')}
          </b>
        </p>
        <ConfirmationDialog
          header={t('entities.user.auth.segmentHeader')}
          description={t('entities.user.auth.addPassword.description')}
          button={t('entities.user.auth.addPassword.button')}
          onApprove={this.createLocalIdentity}
          disabled={user.identityLocal !== undefined}
        />
        <ConfirmationDialog
          header={t('entities.user.auth.segmentHeader')}
          description={t('entities.user.auth.removePassword.description')}
          button={t('entities.user.auth.removePassword.button')}
          onApprove={this.removeLocalIdentity}
          disabled={user.identityLocal === undefined}
        />
        <br />
        <br />
        <ConfirmationDialogWithParameter
          header={t('entities.user.auth.segmentHeader')}
          description={t('entities.user.auth.addLdap.description')}
          button={t('entities.user.auth.addLdap.button')}
          inputField="LDAP Username"
          onApprove={this.createLdapIdentity}
          disabled={user.identityLdap !== undefined}
        />
        <ConfirmationDialogWithParameter
          header={t('entities.user.auth.segmentHeader')}
          description={t('entities.user.auth.updateLdap.description')}
          button={t('entities.user.auth.updateLdap.button')}
          inputField="LDAP Username"
          onApprove={this.updateLdapIdentity}
          defaultInput={user.identityLdap?.username}
          disabled={user.identityLdap === undefined}
        />
        <ConfirmationDialog
          header={t('entities.user.auth.segmentHeader')}
          description={t('entities.user.auth.removeLdap.description')}
          button={t('entities.user.auth.removeLdap.button')}
          onApprove={this.removeLdapIdentity}
          disabled={user.identityLdap === undefined}
        />
      </Segment>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchUser: (id: number) => dispatch(fetchSingle(SingleEntities.User, id)),
});

export default withTranslation()(connect(null, mapDispatchToProps)(UserAuthSettings));
