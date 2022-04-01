import * as React from 'react';
import {
  Button, Dropdown, Icon, Modal,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  Body, Client, Contract, InvoiceCreateParams, InvoiceStatus, InvoiceSummary,
} from '../clients/server.generated';
import { RootState } from '../stores/store';
import { SummaryCollections } from '../stores/summaries/summaries';
import { getSummaryCollection } from '../stores/summaries/selectors';
import { createSingle, fetchSingle } from '../stores/single/actionCreators';
import { SingleEntities } from '../stores/single/single';

interface SelfProps extends RouteComponentProps<{ contractId: string }>, WithTranslation {
}

interface Props extends SelfProps {
  contract: Contract;
  productInstanceIds: number[];
  clearSelection: () => void;
  invoices: InvoiceSummary[];
  onCancel?: () => void;
  createInvoice: (invoice: InvoiceCreateParams) => void;
  fetchContract: (id: number) => void;
}

interface State {
  open: boolean;
  selectedInvoice: number | undefined;
  loading: boolean;
}

class ContractInvoiceModal extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      selectedInvoice: -1,
      loading: false,
    };
  }

  save = async () => {
    const {
      contract, productInstanceIds, createInvoice, fetchContract, clearSelection,
    } = this.props;
    this.setState({ loading: true });

    if (this.state.selectedInvoice === -1) {
      await createInvoice(new InvoiceCreateParams({
        title: contract.title,
        companyId: contract.companyId,
        productInstanceIds,
      }));
    } else if (this.state.selectedInvoice !== undefined) {
      const client = new Client();
      await Promise.all(this.props.productInstanceIds.map((x) => {
        return client.addProduct(this.state.selectedInvoice!, new Body({ productId: x }));
      }));
      fetchContract(contract.id);
    }
    clearSelection();
    this.setState({ open: false, loading: false });
  };

  public render() {
    const {
      invoices, contract, t,
    } = this.props;
    const { loading, selectedInvoice } = this.state;
    const availableInvoices = invoices.filter((i) => {
      return i.companyId === contract.companyId
        && (i.status === InvoiceStatus.CREATED || i.status === InvoiceStatus.PROPOSED);
    });
    const dropdownOptions = [{ key: -1, text: t('pages.contract.products.createNewInvoice'), value: -1 }, ...availableInvoices.map((x) => ({
      key: x.id,
      description: `F${x.id.toString()}`,
      text: x.title,
      value: x.id,
    }))];

    dropdownOptions.push();

    const header = this.props.productInstanceIds.length === 1
      ? t('pages.contract.products.addSingleToInvoice')
      : t('pages.contract.products.addToInvoice', { amount: this.props.productInstanceIds.length });

    const dropdown = (
      <Dropdown
        placeholder={t('entity.invoice')}
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
        <Icon name="money bill alternate outline" />
        {header}
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
        <Modal.Header>
          {header}
          <Button
            icon
            labelPosition="left"
            color="green"
            floated="right"
            onClick={this.save}
            loading={loading}
          >
            <Icon name="save" />
            {t('buttons.save')}
          </Button>
          <Button
            icon
            floated="right"
            onClick={() => { this.setState({ open: false }); }}
          >
            {t('buttons.cancel')}
          </Button>
        </Modal.Header>
        <Modal.Content attached="bottom">
          {dropdown}
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    invoices: getSummaryCollection<InvoiceSummary>(state, SummaryCollections.Invoices).options,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createInvoice: (invoice: InvoiceCreateParams) => dispatch(
    createSingle(SingleEntities.Invoice, invoice),
  ),
  fetchContract: (id: number) => dispatch(
    fetchSingle(SingleEntities.Contract, id),
  ),
});

export default withTranslation()(withRouter(connect(mapStateToProps,
  mapDispatchToProps)(ContractInvoiceModal)));
