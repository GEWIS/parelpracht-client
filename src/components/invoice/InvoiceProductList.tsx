import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import InvoiceProductRow from './InvoiceProductRow';
import { ActivityType, Client, Invoice } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';

interface Props extends RouteComponentProps {
  invoice: Invoice;

  fetchInvoice: (id: number) => void;
}

interface State {}

class InvoiceProductList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  removeProduct = async (instanceId: number) => {
    const { invoice, fetchInvoice } = this.props;
    const client = new Client();
    await client.deleteProduct2(invoice?.id, instanceId);
    fetchInvoice(invoice.id);
  };

  deleteButtonActive() {
    return !(this.props.invoice.activities
      .filter((a) => a.type === ActivityType.STATUS).length > 1);
  }

  public render() {
    console.log(this.deleteButtonActive());
    const { invoice } = this.props;

    const { products } = invoice;
    let priceSum = 0;
    let discountAmount = 0;
    let discountSum = 0;

    products.forEach((p) => {
      priceSum += p.basePrice;
      discountSum += p.discount;
      if (p.discount !== 0) {
        discountAmount++;
      }
    });

    const discountedPriceSum = priceSum - discountSum;

    return (
      <>
        <h3>
          Products
        </h3>
        <Table compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell collapsing>Discount</Table.HeaderCell>
              <Table.HeaderCell collapsing>Real Price</Table.HeaderCell>
              <Table.HeaderCell collapsing>Contract</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>

          </Table.Header>
          <Table.Body>
            {products.map((product) => (
              <InvoiceProductRow
                key={product.id}
                productInstance={product}
                removeProduct={this.removeProduct}
                canDelete={this.deleteButtonActive()}
              />
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell textAlign="right"> Totals: </Table.HeaderCell>
              <Table.HeaderCell collapsing>
                {formatPriceFull(discountSum)}
                {' '}
                (
                {discountAmount}
                )
              </Table.HeaderCell>
              <Table.HeaderCell collapsing>
                {formatPriceFull(discountedPriceSum)}
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Footer>
        </Table>
      </>
    );
  }
}

export default withRouter(InvoiceProductList);
