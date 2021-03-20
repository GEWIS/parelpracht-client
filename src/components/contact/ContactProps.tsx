import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Dropdown, Form, Input, TextArea,
} from 'semantic-ui-react';
import validator from 'validator';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Contact, ContactFunction, ContactParams, Gender,
} from '../../clients/server.generated';
import {
  createSingle, deleteSingle, fetchSingle, saveSingle,
} from '../../stores/single/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import PropsButtons from '../PropsButtons';
import { SingleEntities } from '../../stores/single/single';
import { getSingle } from '../../stores/single/selectors';
import { formatContactName, formatFunction } from '../../helpers/contact';
import { TransientAlert } from '../../stores/alerts/actions';
import { showTransientAlert } from '../../stores/alerts/actionCreators';

interface Props extends RouteComponentProps {
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
      firstName, lastName, email, telephone,
    } = this.state;
    return (validator.isEmpty(firstName)
      || validator.isEmpty(lastName)
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

    return (
      <>
        <h2>
          {this.props.create ? 'New Contact' : 'Details'}

          <PropsButtons
            editing={editing}
            canDelete={this.deleteButtonActive()}
            canSave={!this.propsHaveErrors()}
            entity={SingleEntities.Contact}
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
              label="First Name"
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
              label="Middle Name"
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
              label="Last Name"
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
            <Form.Field required fluid disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-gender">Gender</label>
              <Dropdown
                id="form-input-gender"
                selection
                placeholder="Gender"
                value={gender}
                options={[
                  { key: 0, text: 'Male', value: Gender.MALE },
                  { key: 1, text: 'Female', value: Gender.FEMALE },
                  { key: 2, text: 'Unknown', value: Gender.UNKNOWN },
                ]}
                onChange={(e, data) => this.setState({
                  gender: data.value as Gender,
                })}
                fluid
              />
            </Form.Field>
            <Form.Field required fluid disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-function">Function</label>
              <Dropdown
                id="form-input-function"
                selection
                placeholder="Function"
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
              label="Email address"
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
              control={Input}
              label="Telephone number"
              value={telephone}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                telephone: e.target.value,
              })}
              error={
                !validator.isEmpty(telephone!) && !validator.isMobilePhone(telephone!)
              }
            />
          </Form.Group>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-comments">
              Comments
            </label>
            <TextArea
              id="form-delivery-spec-english"
              value={comments}
              onChange={
                (e) => this.setState({ comments: e.target.value })
              }
              placeholder="Comments"
              fluid
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContactProps));
