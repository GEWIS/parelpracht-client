import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Loader, Table,
} from 'semantic-ui-react';
import InvoiceProductComponent from './InvoiceProductRow';
import { Invoice } from '../../clients/server.generated';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import { formatPriceFull } from '../../helpers/monetary';

interface Props extends RouteComponentProps {
  invoice: Invoice | undefined;
}

interface State {

}

class InvoiceProductList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const { invoice } = this.props;

    if (invoice === undefined) {
      return (
        <Loader content="Loading" active />
      );
    }

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
            </Table.Row>

          </Table.Header>
          <Table.Body>
            {products.map((product) => (
              <InvoiceProductComponent key={product.id} productInstance={product} />
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell textAlign="right"> Totals: </Table.HeaderCell>
              <Table.HeaderCell>
                {formatPriceFull(discountSum)}
                {' '}
                (
                {discountAmount}
                )
              </Table.HeaderCell>
              <Table.HeaderCell>
                {formatPriceFull(discountedPriceSum)}
              </Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Footer>
        </Table>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    invoice: getSingle<Invoice>(state, SingleEntities.Invoice).data,
    status: getSingle<Invoice>(state, SingleEntities.Invoice).status,
  };
};

const mapDispatchToProps = () => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InvoiceProductList));
