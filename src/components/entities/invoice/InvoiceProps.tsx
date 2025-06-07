import { ChangeEvent, Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Form, Input, TextArea } from 'semantic-ui-react';
import validator from 'validator';
import { withTranslation, WithTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import {
  ActivityType,
  Invoice,
  InvoiceStatus,
  Partial_InvoiceParams_,
  Roles,
} from '../../../clients/server.generated';
import { getCompanyName } from '../../../stores/company/selectors';
import ResourceStatus from '../../../stores/resourceStatus';
import { deleteSingle, saveSingle } from '../../../stores/single/actionCreators';
import { getSingle } from '../../../stores/single/selectors';
import { SingleEntities } from '../../../stores/single/single';
import { RootState } from '../../../stores/store';
import PropsButtons from '../../PropsButtons';
import { isInvalidDate } from '../../../helpers/timestamp';
import UserSelector from '../user/UserSelector';
import { formatDocumentIdTitle } from '../../../helpers/documents';
import { TransientAlert } from '../../../stores/alerts/actions';
import { showTransientAlert } from '../../../stores/alerts/actionCreators';
import AuthorizationComponent from '../../AuthorizationComponent';
import { withRouter, WithRouter } from '../../../WithRouter';
import 'react-datepicker/dist/react-datepicker.css';

interface Props extends WithTranslation, WithRouter {
  create?: boolean;
  onCancel?: () => void;

  invoice: Invoice;
  status: ResourceStatus;

  companyName: string;

  saveInvoice: (id: number, invoice: Partial_InvoiceParams_) => void;
  deleteInvoice: (id: number) => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

interface State {
  editing: boolean;

  title: string;
  comments: string | undefined;
  companyId: number;
  assignedToId: number | undefined;
  poNumber: string;
  startDate: Date;
}

class InvoiceProps extends Component<Props, State> {
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

      this.setState({ editing: false });
      this.props.showTransientAlert({
        title: 'Success',
        message: `Properties of ${formatDocumentIdTitle(
          this.props.invoice.id,
          this.props.invoice.title,
          SingleEntities.Invoice,
        )} successfully updated.`,
        type: 'success',
        displayTimeInMs: 3000,
      });
    }
  }

  extractState = (props: Props) => {
    const { invoice, companyName } = props;
    return {
      title: invoice.title,
      comments: invoice.comments,
      companyId: invoice.companyId,
      companyName,
      assignedToId: invoice.assignedToId,
      poNumber: invoice.poNumber ?? '',
      startDate: invoice.startDate,
    };
  };

  toParams = (): Partial_InvoiceParams_ => {
    return new Partial_InvoiceParams_({
      title: this.state.title,
      comments: this.state.comments,
      assignedToId: this.state.assignedToId,
      poNumber: this.state.poNumber,
      startDate: this.state.startDate,
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
    if (!this.props.create) {
      this.props.saveInvoice(this.props.invoice.id, this.toParams());
    }
  };

  remove = () => {
    if (!this.props.create) {
      const { navigate } = this.props.router;
      navigate('/invoice');
      this.props.deleteInvoice(this.props.invoice.id);
    }
  };

  propsHaveErrors = (): boolean => {
    const { title, startDate } = this.state;
    const statusActivities = this.props.invoice.activities
      .filter((a) => a.type === ActivityType.STATUS);
    return (validator.isEmpty(title)
      || startDate.toString() === 'Invalid Date'
      || (startDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
      && startDate.setHours(0, 0, 0, 0)
      < this.props.invoice.startDate.setHours(0, 0, 0, 0))
      || statusActivities[statusActivities.length - 1].subType === InvoiceStatus.PAID);
  };

  deleteButtonActive = () => {
    const { create, invoice } = this.props;
    if (create) {
      return undefined;
    }
    return !(invoice.products.length > 0 || invoice.files.length > 0
      || invoice.activities.filter((a) => a.type === ActivityType.STATUS).length > 1);
  };

  render() {
    const {
      editing,
      comments,
      title,
      poNumber,
      startDate,
      assignedToId,
    } = this.state;
    const { companyName, t } = this.props;

    return (
      <>
        <h2>
          {this.props.create ? t('pages.invoice.newInvoice') : t('entities.details')}

          <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
            <PropsButtons
              editing={editing}
              canEdit
              canDelete={this.deleteButtonActive()}
              canSave={!this.propsHaveErrors()}
              entity={SingleEntities.Invoice}
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
              id="form-input-title"
              fluid
              control={Input}
              label={t('entities.invoice.props.title')}
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                this.setState({ title: e.target.value });
              }}
              error={validator.isEmpty(title)}
            />
            <Form.Field
              disabled={!editing}
            >
                            <label htmlFor="form-assigned-to-selector">{t('entities.generalProps.assignedTo')}</label>
              <UserSelector
                id="form-assigned-to-selector"
                value={assignedToId}
                onChange={(val: number) => this.setState({
                  assignedToId: val,
                })}
                role={Roles.GENERAL}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled
              id="form-input-company"
              fluid
              control={Input}
              label={t('entity.company')}
              value={companyName}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              id="form-input-ponumber"
              fluid
              control={Input}
              label={t('entities.invoice.props.poNumber')}
              value={poNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                this.setState({ poNumber: e.target.value });
              }}
            />
            <Form.Field
              disabled={!editing}
              error={(startDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                && startDate.setHours(0, 0, 0, 0)
                < this.props.invoice.startDate.setHours(0, 0, 0, 0)) || isInvalidDate(startDate)}
            >
                            <label htmlFor="form-input-startdate">{t('entities.invoice.props.invoiceDate')}</label>
              <DatePicker
                onChange={(date) => {
                  if (date) this.setState({ startDate: date });
                }}
                selected={startDate}
                minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                onChangeRaw={e => e?.preventDefault()}
                id="form-input-startdate"
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field disabled={!editing}>
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
          </Form.Group>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state: RootState, props: { invoice: Invoice }) => {
  return {
    status: getSingle<Invoice>(state, SingleEntities.Invoice).status,
    companyName: getCompanyName(state, props.invoice.companyId),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveInvoice: (id: number, invoice: Partial_InvoiceParams_) => dispatch(
    saveSingle(SingleEntities.Invoice, id, invoice),
  ),
  deleteInvoice: (id: number) => dispatch(
    deleteSingle(SingleEntities.Invoice, id),
  ),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withTranslation()(withRouter(connect(mapStateToProps,
  mapDispatchToProps)(InvoiceProps)));
