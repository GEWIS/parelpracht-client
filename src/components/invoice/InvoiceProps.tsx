import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Form, Input } from 'semantic-ui-react';
import {
  Invoice, InvoiceParams, ProductInstance,
} from '../../clients/server.generated';
import { getCompanyName } from '../../stores/company/selectors';
import ResourceStatus from '../../stores/resourceStatus';
import { createSingle, saveSingle } from '../../stores/single/actionCreators';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';

interface Props {
  create?: boolean;
  onCancel?: () => void;

  invoice: Invoice;
  status: ResourceStatus;

  companyName: string;

  saveInvoice: (id: number, invoice: InvoiceParams) => void;
  createInvoice: (invoice: InvoiceParams) => void;
}

interface State {
  editing: boolean;

  productInstanceIds: number[];
  comments: string | undefined;
  companyId: number;
  assignedToId: number;
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
      productInstanceIds: invoice.products.map((p) => p.id),
      comments: invoice.comments,
      companyId: invoice.companyId,
      companyName,
      assignedToId: invoice.assignedToId,
    };
  };

  toParams = (): InvoiceParams => {
    return new InvoiceParams({
      productInstanceIds: this.state.productInstanceIds,
      comments: this.state.comments,
      companyId: this.state.companyId,
      assignedToId: this.state.assignedToId,
    });
  };

  render() {
    const {
      editing,
      productInstanceIds,
      comments,
      companyId,
      assignedToId,
    } = this.state;
    const { companyName } = this.props;

    return (
      <>
        <h2>
          {this.props.create ? 'New Invoice' : 'Details'}
        </h2>
        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              id="form-input-title"
              fluid
              control={Input}
              label="Company"
              value={companyName}
            />
            <Form.Field
              disabled={!editing}
              fluid
              id="form-input-productIDs"
              control={Input}
              label="Products"
              value={productInstanceIds}
            />
            <Form.Field
              disabled={!editing}
              fluid
              id="form-input-comments"
              control={Input}
              label="comments"
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

const mapStateToProps = (state: RootState, props: {invoice: Invoice}) => {
  return {
    status: getSingle<Invoice>(state, SingleEntities.Invoice).status,
    companyName: getCompanyName(state, props.invoice.companyId),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveInvoice: (id: number, invoice: InvoiceParams) => dispatch(
    saveSingle(SingleEntities.Invoice, id, invoice),
  ),
  createInvoice: (invoice: InvoiceParams) => dispatch(
    createSingle(SingleEntities.Invoice, invoice),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceProps);
