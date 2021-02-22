import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Form, Input, TextArea } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import { ActivityType, Invoice, Partial_InvoiceParams } from '../../clients/server.generated';
import { getCompanyName } from '../../stores/company/selectors';
import ResourceStatus from '../../stores/resourceStatus';
import { deleteSingle, saveSingle } from '../../stores/single/actionCreators';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import PropsButtons from '../PropsButtons';
import { formatTimestampToDate } from '../../helpers/timestamp';
import UserSelector from '../user/UserSelector';

interface Props {
  create?: boolean;
  onCancel?: () => void;

  invoice: Invoice;
  status: ResourceStatus;

  companyName: string;

  saveInvoice: (id: number, invoice: Partial_InvoiceParams) => void;
  deleteInvoice: (id: number) => void;
}

interface State {
  editing: boolean;

  title: string;
  comments: string | undefined;
  companyId: number;
  assignedToId: number;
  poNumber: string;
  startDate: Date;
}

class InvoiceProps extends React.Component<Props, State> {
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

  toParams = (): Partial_InvoiceParams => {
    return new Partial_InvoiceParams({
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
      this.props.deleteInvoice(this.props.invoice.id);
    }
  };

  deleteButtonActive = () => {
    if (this.props.create) {
      return undefined;
    }
    return !(this.props.invoice.products.length > 0 || this.props.invoice.files.length > 0
      || this.props.invoice.activities.filter((a) => a.type === ActivityType.STATUS).length > 1);
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
    const { companyName } = this.props;

    return (
      <>
        <h2>
          {this.props.create ? 'New Invoice' : 'Details'}
          <PropsButtons
            editing={editing}
            canDelete={this.deleteButtonActive()}
            entity={SingleEntities.Invoice}
            status={this.props.status}
            cancel={this.cancel}
            edit={this.edit}
            save={this.save}
            remove={this.remove}
          />
        </h2>
        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              id="form-input-title"
              fluid
              control={Input}
              label="Title"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                this.setState({ title: e.target.value });
              }}
            />
            <Form.Field
              disabled={!editing}
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-assigned-to-selector">Assigned to</label>
              <UserSelector
                id="form-assigned-to-selector"
                value={assignedToId}
                onChange={(val: number) => this.setState({
                  assignedToId: val,
                })}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled
              id="form-input-company"
              fluid
              control={Input}
              label="Company"
              value={companyName}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              id="form-input-ponumber"
              fluid
              control={Input}
              label="PO Number"
              value={poNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                this.setState({ poNumber: e.target.value });
              }}
            />
            <Form.Field disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-startdate">Invoice date</label>
              <DateInput
                onChange={(e, { value }) => {
                  this.setState({ startDate: new Date(Date.parse(value)) });
                }}
                value={formatTimestampToDate(startDate)}
                id="form-input-startdate"
                dateFormat="YYYY-MM-DD"
                fluid
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              fluid
              id="form-input-comments"
              control={TextArea}
              label="Comments"
              value={comments}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                comments: e.target.value,
              })}
            />
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
  saveInvoice: (id: number, invoice: Partial_InvoiceParams) => dispatch(
    saveSingle(SingleEntities.Invoice, id, invoice),
  ),
  deleteInvoice: (id: number) => dispatch(
    deleteSingle(SingleEntities.Invoice, id),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceProps);
