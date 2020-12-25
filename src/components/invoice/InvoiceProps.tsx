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
  Company, Invoice, InvoiceParams, ProductInstance,
} from '../../clients/server.generated';
import { formatPrice } from '../../helpers/monetary';
import ResourceStatus from '../../stores/resourceStatus';
import { createSingle, saveSingle } from '../../stores/single/actionCreators';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
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
  productInstances: ProductInstance[];
  comments: string | undefined;
  companyId: number;
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
      productInstances: invoice.products,
      comments: invoice.comments,
      companyId: invoice.companyId,
    };
  };

  toParams = (): InvoiceParams => {
    return new InvoiceParams({
      productInstances: this.state.productInstances,
      comments: this.state.comments,
      companyId: this.state.companyId,
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
      productInstances,
      comments,
      companyId,
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
