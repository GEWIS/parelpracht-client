import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Icon, Loader, Table,
} from 'semantic-ui-react';
import _ from 'lodash';
import ContractProductComponent from './ContractProductComponent';
import { Contract } from '../../clients/server.generated';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import { formatPrice } from '../../helpers/monetary';

interface Props extends RouteComponentProps {
  contract: Contract | undefined;
}

interface State {
  selected: number[];
}

class ContractProductList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      selected: [],
    };
  }

  selectProduct = (id: number) => {
    const { selected } = this.state;
    this.setState({ selected: _.xor(selected, [id]) });
  };

  public render() {
    const { contract } = this.props;
    const { selected } = this.state;

    if (contract === undefined) {
      return (
        <Loader content="Loading" active />
      );
    }

    const { products } = contract;
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
        <h2>
          Products
          <Button
            icon
            labelPosition="left"
            floated="right"
            style={{ marginTop: '-0.5em' }}
            basic
            as={NavLink}
            to={`${this.props.location.pathname}/product/new`}
          >
            Add Product
          </Button>
          <Button
            icon
            labelPosition="left"
            floated="right"
            style={{ marginTop: '-0.5em' }}
            basic
            as={NavLink}
            to={`${this.props.location.pathname}/invoice`}
            disabled={selected.length === 0}
          >
            Add
            {' '}
            {(selected.length)}
            {' '}
            products to Invoice
          </Button>

        </h2>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Select</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Base Price</Table.HeaderCell>
              <Table.HeaderCell>Discount</Table.HeaderCell>
              <Table.HeaderCell>Discounted Price</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>

          </Table.Header>
          <Table.Body>
            {products.map((product) => (
              <ContractProductComponent
                key={product.id}
                productInstance={product}
                selectFunction={this.selectProduct}
              />
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell> Totals: </Table.HeaderCell>
              <Table.HeaderCell>
                {' €'}
                {formatPrice(priceSum)}
                {' '}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {' €'}
                {formatPrice(discountSum)}
                {' '}
                (
                {discountAmount}
                {' '}
                discounts)
                {' '}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {' €'}
                {formatPrice(discountedPriceSum)}
                {' '}
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
    contract: getSingle<Contract>(state, SingleEntities.Contract).data,
    status: getSingle<Contract>(state, SingleEntities.Contract).status,
  };
};

const mapDispatchToProps = () => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContractProductList));
