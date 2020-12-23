import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb,
  Container, Grid, Loader, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Invoice } from '../clients/server.generated';
import { RootState } from '../stores/store';
import ResourceStatus from '../stores/resourceStatus';
import InvoiceSummary from '../components/invoice/InvoiceSummary';
import InvoiceProps from '../components/invoice/InvoiceProps';
import { clearSingleInvoice, fetchSingleInvoice } from '../stores/invoice/actionCreators';

interface Props extends RouteComponentProps<{ invoiceId: string }> {
  invoice: Invoice | undefined;
  status: ResourceStatus;

  fetchInvoice: (id: number) => void;
  clearInvoice: () => void;
}

class SingleInvoicePage extends React.Component<Props> {
  componentDidMount() {
    const { invoiceId } = this.props.match.params;

    this.props.clearInvoice();
    this.props.fetchInvoice(Number.parseInt(invoiceId, 10));
  }

  public render() {
    const { invoice } = this.props;

    if (invoice === undefined) {
      return (
        <Container style={{ paddingTop: '2em' }}>
          <Loader content="Loading" active />
        </Container>
      );
    }

    return (
      <Container style={{ paddingTop: '2em' }}>
        <Breadcrumb
          icon="right angle"
          sections={[
            { key: 'Invoices', content: <NavLink to="/invoice">Invoices</NavLink> },
            { key: 'Invoice', content: invoice.id, active: true },
          ]}
        />
        <InvoiceSummary />
        <Grid columns={2}>
          <Grid.Column>
            <Segment>
              <InvoiceProps invoice={invoice} />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    invoice: state.invoice.single,
    status: state.invoice.singleStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchInvoice: (id: number) => dispatch(fetchSingleInvoice(id)),
  clearInvoice: () => dispatch(clearSingleInvoice()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleInvoicePage));
