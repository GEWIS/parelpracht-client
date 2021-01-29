import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Icon, Loader, Table,
} from 'semantic-ui-react';
import _ from 'lodash';
import ContractProductComponent from './ContractProductRow';
import { Contract } from '../../clients/server.generated';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import { formatPrice, formatPriceFull } from '../../helpers/monetary';
import ContractInvoiceModal from '../../pages/ContractInvoiceModal';

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
        <h3>
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
            <Icon name="plus" />
            Add Product
          </Button>
          <ContractInvoiceModal
            productInstanceIds={selected}
            companyId={contract.companyId}
          />

        </h3>
        <Table compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell collapsing>Discount</Table.HeaderCell>
              <Table.HeaderCell collapsing>Real Price</Table.HeaderCell>
              <Table.HeaderCell collapsing>Status</Table.HeaderCell>
              <Table.HeaderCell collapsing>Invoice</Table.HeaderCell>
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
              <Table.HeaderCell singleLine collapsing>
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

const mapStateToProps = (state: RootState) => {
  return {
    contract: getSingle<Contract>(state, SingleEntities.Contract).data,
    status: getSingle<Contract>(state, SingleEntities.Contract).status,
  };
};

const mapDispatchToProps = () => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContractProductList));
