import React, {
  ChangeEvent,
} from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Checkbox,
  Form, Input, Label, TextArea,
} from 'semantic-ui-react';
import {
  Company, Invoice, InvoiceParams, InvoiceStatus, ProductInstance, Status,
} from '../../clients/server.generated';
import { formatPrice } from '../../helpers/monetary';
import { createSingleInvoice } from '../../stores/invoice/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import InvoicePropsButtons from './InvoicePropsButtons';

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
  product: ProductInstance[];
  comment: string;
  companyId: number;
  price: number;
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
      product: invoice.products,
      comment: invoice.comment,
      companyId: invoice.companyId,
      price: invoice.price,
    };
  };

  toParams = (): InvoiceParams => {
    return new InvoiceParams({
      product: this.state.product,
      comment: this.state.comment,
      companyId: this.state.companyId,
      price: this.state.price,
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
      product,
      comment,
      companyId,
      price,
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
    status: state.invoice.singleStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveInvoice: (id: number, invoice: InvoiceParams) => dispatch(createSingleInvoice(invoice)),
  createInvoice: (invoice: InvoiceParams) => dispatch(createSingleInvoice(invoice)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceProps);
