import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Invoice, InvoiceParams, ProductInstance,
} from '../../clients/server.generated';
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
    const { invoice } = props;
    return {
      productInstanceIds: invoice.products.map((p) => p.id),
      comments: invoice.comments,
      companyId: invoice.companyId,
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
      this.props.createInvoice(this.toParams());
    } else {
      this.props.saveInvoice(this.props.invoice.id, this.toParams());
    }
  };

  render() {
    const {
      editing,
      productInstanceIds,
      comments,
      companyId,
      assignedToId,
    } = this.state;

    return (
      <>
        <h2>
          hallllllllllllllooooooooooooooooooo invoices
        </h2>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<Invoice>(state, SingleEntities.Invoice).status,
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
