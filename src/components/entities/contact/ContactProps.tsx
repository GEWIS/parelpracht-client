import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Dropdown, Form, Input, TextArea,
} from 'semantic-ui-react';
import { WithTranslation, withTranslation } from 'react-i18next';
import validator from 'validator';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Contact, ContactFunction, ContactParams, Gender, Roles,
} from '../../../clients/server.generated';
import {
  createSingle, deleteSingle, fetchSingle, saveSingle,
} from '../../../stores/single/actionCreators';
import ResourceStatus from '../../../stores/resourceStatus';
import { RootState } from '../../../stores/store';
import PropsButtons from '../../PropsButtons';
import { SingleEntities } from '../../../stores/single/single';
import { getSingle } from '../../../stores/single/selectors';
import { formatContactName, formatFunction } from '../../../helpers/contact';
import { TransientAlert } from '../../../stores/alerts/actions';
import { showTransientAlert } from '../../../stores/alerts/actionCreators';

import AuthorizationComponent from '../../AuthorizationComponent';

interface Props extends WithTranslation, RouteComponentProps {
  create?: boolean;
  onCompanyPage: boolean;
  onCancel?: () => void;

  contact: Contact;
  status: ResourceStatus;

  saveContact: (id: number, contact: ContactParams) => void;
  createContact: (contact: ContactParams) => void;
  deleteContact: (id: number) => void;
  showTransientAlert: (alert: TransientAlert) => void;
  fetchCompany: (id: number) => void;
}

interface State {
  editing: boolean;

  firstName: string;
  lastNamePreposition: string;
  lastName: string;
  gender: Gender;
  email: string;
  telephone: string;
  comments: string;
  func: ContactFunction;
}

class ContactProps extends React.Component<Props, State> {
  static defaultProps = {
    create: undefined,
    onCancel: undefined,
  };

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
      if (this.props.create) {
        this.props.showTransientAlert({
          title: 'Success',
          message: 'Successfully created new contact.',
          type: 'success',
          displayTimeInMs: 3000,
        });
      } else {
        this.props.showTransientAlert({
          title: 'Success',
          message: `Properties of ${formatContactName(
            this.props.contact?.firstName,
            this.props.contact?.lastNamePreposition,
            this.props.contact?.lastName,
          )} successfully updated.`,
          type: 'success',
          displayTimeInMs: 3000,
        });
      }
    }
  }

  extractState = (props: Props) => {
    const { contact } = props;
    return {
      firstName: contact.firstName,
      lastNamePreposition: contact.lastNamePreposition,
      lastName: contact.lastName,
      gender: contact.gender,
      email: contact.email,
      telephone: contact.telephone,
      func: contact.function,
      comments: contact.comments ?? '',
    };
  };

  toParams = (): ContactParams => {
    return new ContactParams({
      firstName: this.state.firstName,
      lastNamePreposition: this.state.lastNamePreposition,
      lastName: this.state.lastName,
      gender: this.state.gender,
      email: this.state.email,
      telephone: this.state.telephone,
      function: this.state.func,
      comments: this.state.comments,
      companyId: this.props.contact.companyId,
    });
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
      this.props.createContact(this.toParams());
    } else {
      this.props.saveContact(this.props.contact.id, this.toParams());
    }
  };

  remove = () => {
    if (!this.props.create) {
      this.props.deleteContact(this.props.contact.id);
      if (this.props.onCompanyPage) {
        this.props.history.push(`/company/${this.props.contact.companyId}`);
        this.props.fetchCompany(this.props.contact.companyId);
      } else {
        this.props.history.push('/contact');
      }
    }
  };

  propsHaveErrors = (): boolean => {
    const {
      lastName, email, telephone,
    } = this.state;
    return (validator.isEmpty(lastName)
      || !validator.isEmail(email)
      || (!validator.isEmpty(telephone!) && !validator.isMobilePhone(telephone!))
    );
  };

  deleteButtonActive = () => {
    if (this.props.create) {
      return undefined;
    }
    return !(this.props.contact.contracts.length > 0);
  };

  render() {
    const {
      editing,
      firstName,
      lastNamePreposition,
      lastName,
      gender,
      email,
      telephone,
      func,
      comments,
    } = this.state;
    const { t } = this.props;

    return (
      <>
        <h2>
          {this.props.create ? t('entities.contact.newContact') : t('entities.company.props.details')}

          <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
            <PropsButtons
              editing={editing}
              canEdit
              canDelete={this.deleteButtonActive()}
              canSave={!this.propsHaveErrors()}
              entity={SingleEntities.Contact}
              status={this.props.status}
              cancel={this.cancel}
              edit={this.edit}
              save={this.save}
              remove={this.remove}
            />
          </AuthorizationComponent>
        </h2>

        <Form style={{ marginTop: '2em' }}>
          <Form.Group>
            <Form.Field
              disabled={!editing}
              id="form-input-first-name"
              fluid
              control={Input}
              label={t('entities.contact.props.firstName')}
              placeholder={t('entities.contact.props.firstName')}
              value={firstName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                firstName: e.target.value,
              })}
              width={6}
            />
            <Form.Field
              disabled={!editing}
              id="form-input-middle-name"
              fluid
              control={Input}
              label={t('entities.contact.props.middleName')}
              placeholder={t('entities.contact.props.middleName')}
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
              label={t('entities.contact.props.lastName')}
              placeholder={t('entities.contact.props.lastName')}
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
            <Form.Field required disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-gender">{t('entities.contact.props.gender.gender')}</label>
              <Dropdown
                id="form-input-gender"
                selection
                placeholder="Gender"
                value={gender}
                options={[
                  { key: 0, text: t('entities.contact.props.gender.male'), value: Gender.MALE },
                  { key: 1, text: t('entities.contact.props.gender.female'), value: Gender.FEMALE },
                  { key: 2, text: t('entities.contact.props.gender.unknown'), value: Gender.UNKNOWN },
                ]}
                onChange={(e, data) => this.setState({
                  gender: data.value as Gender,
                })}
                fluid
              />
            </Form.Field>
            <Form.Field required disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-function">{t('entities.contact.props.function.header')}</label>
              <Dropdown
                id="form-input-function"
                selection
                placeholder={t('entities.contact.props.function.header')}
                value={func}
                options={Object.values(ContactFunction).map((x, i) => ({
                  key: i, value: x, text: formatFunction(x),
                }))}
                onChange={(e, data) => this.setState({
                  func: data.value as ContactFunction,
                })}
                fluid
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              id="form-input-email"
              fluid
              control={Input}
              label={t('entities.contact.props.email')}
              placeholder={t('entities.contact.props.email')}
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
              id="form-input-telephone"
              fluid
              placeholder={t('entities.company.props.number')}
              control={Input}
              label={t('entities.company.props.number')}
              value={telephone}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                telephone: e.target.value,
              })}
              error={
                !validator.isEmpty(telephone!) && !validator.isMobilePhone(telephone!)
              }
            />
          </Form.Group>
          <Form.Field>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-comments">
              {t('entities.contact.props.comments')}
            </label>
            <TextArea
              id="form-delivery-spec-english"
              value={comments}
              onChange={
                (e) => this.setState({ comments: e.target.value })
              }
              placeholder={t('entities.contact.props.comments')}
            />
          </Form.Field>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<Contact>(state, SingleEntities.Contact).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveContact: (id: number,
    contact: ContactParams) => dispatch(
    saveSingle(SingleEntities.Contact, id, contact),
  ),
  createContact: (contact: ContactParams) => dispatch(
    createSingle(SingleEntities.Contact, contact),
  ),
  deleteContact: (id: number) => dispatch(
    deleteSingle(SingleEntities.Contact, id),
  ),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
  fetchCompany: (id: number) => dispatch(
    fetchSingle(SingleEntities.Company, id),
  ),
});

export default withTranslation()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(ContactProps)),
);
