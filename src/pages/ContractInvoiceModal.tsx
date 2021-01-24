import * as React from 'react';
import {
  Button,
  Dropdown,
  Icon,
  Modal, Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Body,
  Client, InvoiceParams, InvoiceSummary,
} from '../clients/server.generated';
import { RootState } from '../stores/store';
import AlertContainer from '../components/alerts/AlertContainer';
import { SummaryCollections } from '../stores/summaries/summaries';
import { getSummaryCollection } from '../stores/summaries/selectors';

interface SelfProps extends RouteComponentProps<{contractId: string}> {
}

interface Props extends SelfProps {
  productInstanceIds: number[];
  companyId: number;
  invoices: InvoiceSummary[];
}

interface State {
  open: boolean;
  selectedInvoice: number | undefined;
}

class ContractInvoiceModal extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      selectedInvoice: undefined,
    };
  }

  save = async () => {
    const client = new Client();
    if (this.state.selectedInvoice === -1) {
      const invoice = await client.createInvoice(new InvoiceParams({
        title: '',
        companyId: this.props.companyId,
        productInstanceIds: this.props.productInstanceIds,
      }));
      this.props.history.push(`/invoice/${invoice.id}`);
    } else if (this.state.selectedInvoice !== undefined) {
      await Promise.all(this.props.productInstanceIds.map((x) => {
        return client.addProduct(this.state.selectedInvoice!, new Body({ productId: x }));
      }));
      this.props.history.push(`/invoice/${this.state.selectedInvoice}`);
    }
  };

  public render() {
    const {
      invoices,
    } = this.props;
    const { selectedInvoice } = this.state;
    const dropdownOptions = [{ key: -1, text: 'Add to new invoice', value: -1 }, ...invoices.map((x) => ({
      key: x.id,
      text: x.id.toString(),
      description: '',
      value: x.id,
    }))];

    dropdownOptions.push();

    const dropdown = (
      <Dropdown
        placeholder="Invoice"
        search
        selection
        options={dropdownOptions}
        value={selectedInvoice}
        onChange={(e, data) => this.setState({ selectedInvoice: data.value as any })}
      />
    );

    const trigger = (
      <Button
        icon
        labelPosition="left"
        floated="right"
        style={{ marginTop: '-0.5em' }}
        basic
        disabled={this.props.productInstanceIds.length === 0}
      >
        Add
        {' '}
        {(this.props.productInstanceIds.length)}
        {' '}
        products to Invoice
      </Button>
    );

    return (
      <Modal
        onClose={() => { this.setState({ open: false }); }}
        onOpen={() => { this.setState({ open: true }); }}
        closeIcon
        open={this.state.open}
        dimmer="blurring"
        size="tiny"
        trigger={trigger}
      >
        <Segment attached="bottom">
          <AlertContainer />
          {dropdown}
          <Button
            icon
            labelPosition="left"
            color="green"
            floated="right"
            onClick={this.save}
          >
            <Icon name="save" />
            Save
          </Button>
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    invoices: getSummaryCollection<InvoiceSummary>(state, SummaryCollections.Invoices).options,
  };
};

export default withRouter(connect(mapStateToProps)(ContractInvoiceModal));
