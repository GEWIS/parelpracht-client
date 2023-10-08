import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Form, Input, TextArea } from 'semantic-ui-react';
import validator from 'validator';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  ActivityType, Contract, ContractParams, Roles,
} from '../../../clients/server.generated';
import { createSingle, deleteSingle, saveSingle } from '../../../stores/single/actionCreators';
import ResourceStatus from '../../../stores/resourceStatus';
import { RootState } from '../../../stores/store';
import CompanySelector from '../company/CompanySelector';
import ContactSelector from '../contact/ContactSelector';
import PropsButtons from '../../PropsButtons';
import { SingleEntities } from '../../../stores/single/single';
import { getSingle } from '../../../stores/single/selectors';
import UserSelector from '../user/UserSelector';
import { TransientAlert } from '../../../stores/alerts/actions';
import { showTransientAlert } from '../../../stores/alerts/actionCreators';
import { formatDocumentIdTitle } from '../../../helpers/documents';
import AuthorizationComponent from '../../AuthorizationComponent';
import { WithRouter, withRouter } from '../../../WithRouter';

interface Props extends WithTranslation, WithRouter {
  create?: boolean;
  companyPredefined?: boolean;
  onCancel?: () => void;

  contract: Contract;
  status: ResourceStatus;

  saveContract: (id: number, contract: ContractParams) => void;
  createContract: (contract: ContractParams) => void;
  deleteContract: (id: number) => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

interface State {
  editing: boolean;

  title: string;
  comments: string;
  contactSelection: number;
  companySelection: number;
  assignedToSelection?: number;
}

class ContractProps extends React.Component<Props, State> {
  static defaultProps = {
    create: undefined,
    companyPredefined: undefined,
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
      this.props.showTransientAlert({
        title: 'Success',
        message: `Properties of ${formatDocumentIdTitle(
          this.props.contract.id,
          this.props.contract.title,
          SingleEntities.Contract,
        )} successfully updated.`,
        type: 'success',
        displayTimeInMs: 3000,
      });
    }
  }

  extractState = (props: Props) => {
    const { contract } = props;
    return {
      title: contract.title,
      companySelection: contract.companyId,
      contactSelection: contract.contactId,
      comments: contract.comments ?? '',
      assignedToSelection: contract.assignedToId,
    };
  };

  toParams = (): ContractParams => {
    return new ContractParams({
      title: this.state.title,
      companyId: this.state.companySelection,
      contactId: this.state.contactSelection,
      comments: this.state.comments,
      assignedToId: this.state.assignedToSelection,
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
      this.props.createContract(this.toParams());
    } else {
      this.props.saveContract(this.props.contract.id, this.toParams());
    }
  };

  remove = () => {
    if (!this.props.create) {
      const { navigate } = this.props.router;
      navigate('/contract');
      this.props.deleteContract(this.props.contract.id);
    }
  };

  propsHaveErrors = (): boolean => {
    const {
      title, companySelection, contactSelection,
    } = this.state;
    return (validator.isEmpty(title)
      || companySelection < 0
      || contactSelection < 0
    );
  };

  deleteButtonActive = () => {
    const { create, contract } = this.props;

    // If we create a contract, do not show the button
    if (create) {
      return undefined;
    }
    // If we violate any preconditions, disable the button
    return !(contract.activities.filter((a) => a.type === ActivityType.STATUS).length > 1
      || contract.products.length > 0 || contract.files.length > 0);
  };

  render() {
    const { t } = this.props;
    const {
      editing,
      title,
      companySelection,
      contactSelection,
      assignedToSelection,
      comments,
    } = this.state;

    return (
      <>
        <h2>
          {this.props.create ? t('pages.contract.newContract') : t('entities.details')}

          <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
            <PropsButtons
              editing={editing}
              canEdit
              canDelete={this.deleteButtonActive()}
              canSave={!this.propsHaveErrors()}
              entity={SingleEntities.Contract}
              status={this.props.status}
              cancel={this.cancel}
              edit={this.edit}
              save={this.save}
              remove={this.remove}
            />
          </AuthorizationComponent>
        </h2>

        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              required
              id="form-input-title"
              fluid
              control={Input}
              label={t('entities.contract.props.title')}
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                title: e.target.value,
              })}
              error={
                validator.isEmpty(title)
              }
            />
            <Form.Field
              disabled={!editing}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-assigned-to-selector">{t('entities.generalProps.assignedTo')}</label>
              <UserSelector
                id="form-assigned-to-selector"
                value={assignedToSelection}
                onChange={(val: number | '') => this.setState({
                  assignedToSelection: val === '' ? undefined : val,
                })}
                clearable
                role={Roles.GENERAL}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field
            disabled={!this.props.create}
            required
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-company-selector">{t('entity.company')}</label>
            <CompanySelector
              id="form-company-selector"
              disabled={this.props.companyPredefined}
              value={companySelection}
              onChange={(val: number) => this.setState({
                companySelection: val,
              })}
            />
          </Form.Field>
          <Form.Field
            disabled={!editing}
            required
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-contact-selector">{t('entity.contact')}</label>
            <ContactSelector
              id="form-contact-selector"
              // disabled={editing && (companySelection === -1)}
              companyId={companySelection}
              value={contactSelection}
              onChange={(val: number) => this.setState({
                contactSelection: val,
              })}
              clearable
              placeholder={t('entity.contact')}
            />
          </Form.Field>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-comments">
              {t('entities.generalProps.comments')}
            </label>
            <TextArea
              id="form-input-comments"
              value={comments}
              onChange={(e) => this.setState({ comments: e.target.value })}
              placeholder={t('entities.generalProps.commentsDescription')}
            />
          </Form.Field>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<Contract>(state, SingleEntities.Contract).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveContract: (id: number,
    contract: ContractParams) => dispatch(
    saveSingle(SingleEntities.Contract, id, contract),
  ),
  createContract: (contract: ContractParams) => dispatch(
    createSingle(SingleEntities.Contract, contract),
  ),
  deleteContract: (id: number) => dispatch(
    deleteSingle(SingleEntities.Contract, id),
  ),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withTranslation()(withRouter(connect(mapStateToProps,
  mapDispatchToProps)(ContractProps)));
