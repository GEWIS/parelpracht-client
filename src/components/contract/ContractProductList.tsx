import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Icon, Loader, Table,
} from 'semantic-ui-react';
import _ from 'lodash';
import ContractProductRow from './ContractProductRow';
import { Contract, ContractStatus, Roles } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { formatPriceFull } from '../../helpers/monetary';
import ContractInvoiceModal from '../../pages/ContractInvoiceModal';
import { getContractStatus } from '../../stores/contract/selectors';
import AuthorizationComponent from '../AuthorizationComponent';

interface Props extends RouteComponentProps {
  contract: Contract;
  contractStatus: ContractStatus;
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

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (prevProps.contract.products.length > this.props.contract.products.length) {
      // The following operation is safe, because we only change the state if one
      // of the products has been removed. We do this check on the props and not
      // on the state, so there is no infinite loop.
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ selected: [] });
    }
  }

  clearSelection = () => {
    this.setState({ selected: [] });
  };

  selectProduct = (id: number) => {
    const { selected } = this.state;
    this.setState({ selected: _.xor(selected, [id]) });
  };

  public render() {
    const { contract, contractStatus } = this.props;
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

    const canChangeProducts = contractStatus === ContractStatus.CREATED
      || contractStatus === ContractStatus.PROPOSED
      || contractStatus === ContractStatus.SENT;

    return (
      <>
        <h3>
          Products
          <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
            <Button
              icon
              labelPosition="left"
              floated="right"
              style={{ marginTop: '-0.5em' }}
              basic
              as={NavLink}
              to={`${this.props.location.pathname}/product/new`}
              disabled={!canChangeProducts}
            >
              <Icon name="plus" />
              Add Product
            </Button>
            <ContractInvoiceModal
              contract={contract}
              productInstanceIds={selected}
              clearSelection={this.clearSelection}
            />
          </AuthorizationComponent>

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
            {products.sort((a, b) => a.id - b.id).map((product) => (
              <ContractProductRow
                key={product.id}
                productInstance={product}
                selectFunction={this.selectProduct}
                selected={selected.includes(product.id)}
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

const mapStateToProps = (state: RootState, props: { contract: Contract }) => ({
  contractStatus: getContractStatus(state, props.contract.id),
});

const mapDispatchToProps = () => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContractProductList));
