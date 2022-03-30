import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Checkbox, Dropdown, Form, Icon, Input, Popup, Segment,
} from 'semantic-ui-react';
import validator from 'validator';
import _ from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  Gender, LoginMethods, Roles, User, UserParams,
} from '../../../clients/server.generated';
import { createSingle, deleteSingle, saveSingle } from '../../../stores/single/actionCreators';
import ResourceStatus from '../../../stores/resourceStatus';
import { RootState } from '../../../stores/store';
import PropsButtons from '../../PropsButtons';
import { SingleEntities } from '../../../stores/single/single';
import { getSingle } from '../../../stores/single/selectors';
import TextArea from '../../TextArea';
import { authedUserHasRole } from '../../../stores/auth/selectors';

interface Props extends RouteComponentProps, WithTranslation {
  create?: boolean;
  onCancel?: () => void;

  user: User;
  status: ResourceStatus;
  loginMethod: LoginMethods;
  actorIsAdmin: boolean;

  saveUser: (id: number, user: UserParams) => void;
  createUser: (user: UserParams) => void;
  deleteUser: (id: number) => void;
}

interface State {
  editing: boolean;

  firstName: string;
  lastNamePreposition: string;
  lastName: string;
  gender: Gender;
  email: string;
  comment: string;
  functionName: string;
  replyToEmail: string;
  receiveEmails: boolean;
  sendEmailsToReplyToEmail: boolean;
  roleGeneral: boolean;
  roleSignee: boolean;
  roleFinancial: boolean;
  roleAudit: boolean;
  roleAdmin: boolean;

  ldapOverrideEmail?: boolean;
}

class UserProps extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      editing: props.create ?? false,
      ...this.extractState(props),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ editing: false });
    }
  }

  ldapEnabled = (): boolean => {
    return this.props.loginMethod === LoginMethods.Ldap
      && this.props.user.identityLdap !== undefined;
  };

  extractState = (props: Props) => {
    const { user } = props;
    const result: any = {
      firstName: user.firstName,
      lastNamePreposition: user.lastNamePreposition,
      lastName: user.lastName,
      functionName: user.function,
      gender: user.gender,
      email: user.email,
      comment: user.comment ?? '',
      replyToEmail: user.replyToEmail,

      receiveEmails: user.receiveEmails,
      sendEmailsToReplyToEmail: user.sendEmailsToReplyToEmail,
      roleGeneral: user.roles.find((r) => r.name === Roles.GENERAL) !== undefined,
      roleSignee: user.roles.find((r) => r.name === Roles.SIGNEE) !== undefined,
      roleFinancial: user.roles.find((r) => r.name === Roles.FINANCIAL) !== undefined,
      roleAudit: user.roles.find((r) => r.name === Roles.AUDIT) !== undefined,
      roleAdmin: user.roles.find((r) => r.name === Roles.ADMIN) !== undefined,
    };

    if (this.ldapEnabled()) {
      if (user.identityLdap) {
        result.ldapUsername = user.identityLdap.username ? user.identityLdap.username : '';
        result.ldapOverrideEmail = user.identityLdap.overrideEmail;
      } else {
        result.ldapUsername = '';
        result.ldapOverrideEmail = false;
      }
    }

    return result;
  };

  toParams = (): UserParams => {
    const result = new UserParams({
      firstName: this.state.firstName,
      lastNamePreposition: this.state.lastNamePreposition,
      lastName: this.state.lastName,
      gender: this.state.gender,
      email: this.state.email,
      comment: this.state.comment,
      function: this.state.functionName,
      receiveEmails: this.state.receiveEmails,
      replyToEmail: this.state.replyToEmail,
      sendEmailsToReplyToEmail: this.state.sendEmailsToReplyToEmail,

      roles: _.compact([
        this.state.roleGeneral ? Roles.GENERAL : undefined,
        this.state.roleSignee ? Roles.SIGNEE : undefined,
        this.state.roleFinancial ? Roles.FINANCIAL : undefined,
        this.state.roleAudit ? Roles.AUDIT : undefined,
        this.state.roleAdmin ? Roles.ADMIN : undefined,
      ]),
    });

    if (this.ldapEnabled()) {
      result.ldapOverrideEmail = this.state.ldapOverrideEmail;
    }

    return result;
  };

  edit = () => {
    this.setState({ editing: true, ...this.extractState(this.props) });
  };

  cancel = () => {
    if (!this.props.create) {
      this.setState({ editing: false, ...this.extractState(this.props) });
    } else if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  save = () => {
    if (this.props.create) {
      this.props.createUser(this.toParams());
    } else {
      this.props.saveUser(this.props.user.id, this.toParams());
    }
  };

  remove = () => {
    if (!this.props.create) {
      this.props.history.push('/users');
      this.props.deleteUser(this.props.user.id);
    }
  };

  propsHaveErrors = (): boolean => {
    const {
      firstName, lastName, functionName, email,
    } = this.state;
    return (validator.isEmpty(firstName)
      || validator.isEmpty(lastName)
      || validator.isEmpty(functionName)
      || !validator.isEmail(email)
    );
  };

  deleteButtonActive = () => {
    if (this.props.create) {
      return undefined;
    }
    return !(this.props.user.roles.length > 0);
  };

  render() {
    const { t } = this.props;
    const {
      editing,
      firstName,
      lastNamePreposition,
      lastName,
      gender,
      email,
      functionName,
      comment,
      replyToEmail,
      receiveEmails,
      sendEmailsToReplyToEmail,

      roleGeneral, roleSignee, roleAdmin, roleAudit, roleFinancial,

      ldapOverrideEmail,
    } = this.state;

    const ldapOverrideEmailCheckbox = this.ldapEnabled() ? (
      <Form.Field>
        <Checkbox
          label={t('entities.user.props.overrideLdapEmail')}
          disabled={!editing}
          id="form-override-ldap-email"
          checked={ldapOverrideEmail}
          onChange={(e, data) => this.setState({
            ldapOverrideEmail: data.checked!,
          })}
        />
      </Form.Field>
    ) : (' ');

    const receiveEmailsCheckbox = roleAudit || roleFinancial ? (
      <>
        <Form.Field>
          <Checkbox
            label={t('entities.user.props.mailOnInvoice')}
            disabled={!editing}
            id="form-receive-emails"
            checked={receiveEmails}
            onChange={(e, data) => this.setState({
              receiveEmails: data.checked!,
            })}
          />
        </Form.Field>
      </>
    ) : (
      ' '
    );

    return (
      <>
        <h2>
          {this.props.create ? t('pages.user.newUser') : t('entities.details')}

          <PropsButtons
            editing={editing}
            canEdit
            canDelete={this.deleteButtonActive()}
            canSave={!this.propsHaveErrors()}
            entity={SingleEntities.User}
            status={this.props.status}
            cancel={this.cancel}
            edit={this.edit}
            save={this.save}
            remove={this.remove}
          />
        </h2>

        <Form style={{ marginTop: '2em' }}>
          <Form.Group>
            <Form.Field
              disabled={!editing}
              required
              id="form-input-first-name"
              fluid
              control={Input}
              label={t('entities.user.props.firstName')}
              value={firstName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                firstName: e.target.value,
              })}
              width={6}
              error={
                validator.isEmpty(firstName)
              }
            />
            <Form.Field
              disabled={!editing}
              id="form-input-middle-name"
              fluid
              control={Input}
              label={t('entities.user.props.preposition')}
              value={lastNamePreposition}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                lastNamePreposition: e.target.value,
              })}
              width={4}
            />
            <Form.Field
              disabled={!editing}
              required
              id="form-input-last-name"
              fluid
              control={Input}
              label={t('entities.user.props.lastName')}
              value={lastName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                lastName: e.target.value,
              })}
              width={6}
              error={
                validator.isEmpty(lastName)
              }
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field required disabled={!editing} width={3}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-gender">Gender</label>
              <Dropdown
                id="form-input-gender"
                selection
                placeholder={t('entities.user.props.gender.header')}
                value={gender}
                options={[
                  { key: 0, text: t('entities.user.props.gender.male'), value: Gender.MALE },
                  { key: 1, text: t('entities.user.props.gender.female'), value: Gender.FEMALE },
                  { key: 2, text: t('entities.user.props.gender.unknown'), value: Gender.UNKNOWN },
                ]}
                onChange={(e, data) => this.setState({
                  gender: data.value as Gender,
                })}
                fluid
                width={4}
              />
            </Form.Field>
            <Form.Field
              disabled={!editing}
              id="form-input-function"
              fluid
              required
              width={12}
              control={Input}
              label={t('entities.user.props.function')}
              placeholder={t('entities.user.props.functionDescription')}
              value={functionName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                functionName: e.target.value,
              })}
              error={
                validator.isEmpty(functionName)
              }
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing || (this.ldapEnabled() && !ldapOverrideEmail)}
              id="form-input-email"
              fluid
              required
              control={Input}
              label={t('entities.user.props.personalEmail')}
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                email: e.target.value,
              })}
              error={
                !validator.isEmail(email)
              }
            />
            <Form.Field
              disabled={!editing}
              id="form-input-reply-to-email"
              fluid
              control={Input}
              label={t('entities.user.props.replyToEmail')}
              value={replyToEmail}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                replyToEmail: e.target.value,
              })}
            />
          </Form.Group>
          {ldapOverrideEmailCheckbox}
          <Form.Field>
            <Checkbox
              label={t('entities.user.props.allMailToReplyTo')}
              disabled={!editing}
              id="form-send-emails-to-reply-to"
              checked={sendEmailsToReplyToEmail}
              onChange={(e, data) => this.setState({
                sendEmailsToReplyToEmail: data.checked!,
              })}
            />
          </Form.Field>
          {receiveEmailsCheckbox}
          <Segment>
            <h3>
              {t('pages.user.permissions')}
              {this.ldapEnabled() ? (
                <Popup
                  content={t('entities.user.auth.rolesBlocked')}
                  trigger={<Icon circular size="small" name="lock" style={{ float: 'right' }} />}
                  position="top center"
                />
              ) : null}
            </h3>
            <Form.Group widths="equal">
              <Form.Field>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="form-check-role-signee">
                  {t('entities.user.props.roles.signee')}
                </label>
                <Checkbox
                  disabled={!editing || this.ldapEnabled()}
                  toggle
                  id="form-check-role-signee"
                  checked={roleSignee}
                  onChange={(e, data) => this.setState({
                    roleSignee: data.checked!,
                  })}
                />
              </Form.Field>
              <Form.Field>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="form-check-role-financial">
                  {t('entities.user.props.roles.financial')}
                </label>
                <Checkbox
                  disabled={!editing || this.ldapEnabled()}
                  toggle
                  id="form-check-role-financial"
                  checked={roleFinancial}
                  onChange={(e, data) => this.setState({
                    roleFinancial: data.checked!,
                  })}
                />
              </Form.Field>
              <Form.Field>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="form-check-role-general">
                  {t('entities.user.props.roles.general')}
                </label>
                <Checkbox
                  disabled={!editing || this.ldapEnabled()}
                  toggle
                  id="form-check-role-general"
                  checked={roleGeneral}
                  onChange={(e, data) => this.setState({
                    roleGeneral: data.checked!,
                  })}
                />
              </Form.Field>
              <Form.Field>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="form-check-role-audit">
                  {t('entities.user.props.roles.audit')}
                </label>
                <Checkbox
                  disabled={!editing || this.ldapEnabled()}
                  toggle
                  id="form-check-role-audit"
                  checked={roleAudit}
                  onChange={(e, data) => this.setState({
                    roleAudit: data.checked!,
                  })}
                />
              </Form.Field>
              <Form.Field>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="form-check-role-admin">
                  {t('entities.user.props.roles.admin')}
                </label>
                <Checkbox
                  disabled={!editing || this.ldapEnabled()}
                  toggle
                  id="form-check-role-admin"
                  checked={roleAdmin}
                  onChange={(e, data) => this.setState({
                    roleAdmin: data.checked!,
                  })}
                />
              </Form.Field>
            </Form.Group>
          </Segment>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-comment">
              {t('entities.user.props.comments')}
            </label>
            <TextArea
              id="form-delivery-spec-english"
              value={comment}
              onChange={
                (e) => this.setState({ comment: e.target.value })
              }
              placeholder={t('entities.user.props.comments')}
            />
          </Form.Field>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  status: getSingle<User>(state, SingleEntities.User).status,
  loginMethod: state.general.loginMethod,
  actorIsAdmin: authedUserHasRole(state, Roles.ADMIN),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveUser: (id: number, user: UserParams) => dispatch(
    saveSingle(SingleEntities.User, id, user),
  ),
  createUser: (user: UserParams) => dispatch(
    createSingle(SingleEntities.User, user),
  ),
  deleteUser: (id: number) => dispatch(
    deleteSingle(SingleEntities.User, id),
  ),
});

export default withTranslation()(withRouter(connect(mapStateToProps,
  mapDispatchToProps)(UserProps)));
