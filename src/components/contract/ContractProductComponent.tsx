import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Checkbox, Grid, Header, Icon, Segment, Table,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { ActivityType, ProductInstance } from '../../clients/server.generated';
import './ContractComponent.scss';
import { RootState } from '../../stores/store';
import { getProductName } from '../../stores/product/selectors';
import { formatPrice, formatPriceDiscount, formatPriceFull } from '../../helpers/monetary';

interface Props extends RouteComponentProps {
  productInstance: ProductInstance;

  productName: string;

  selectFunction: (id: number) => void;
}

function showRecentStatus(productInstance: ProductInstance) {
  const statusArray = productInstance.activities.filter((a) => {
    if (a.type === ActivityType.STATUS) return a;
    return null;
  });

  // eslint-disable-next-line no-nested-ternary
  // eslint-disable-next-line
  return statusArray.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0))[0].subType!;
}

class ContractProductComponent extends React.Component<Props> {
  public render() {
    const {
      productInstance, productName, selectFunction,
    } = this.props;
    return (
      <Table.Row>
        <Table.Cell collapsing>
          <Checkbox
            onClick={() => {
              selectFunction(productInstance.id);
            }}
            disabled={productInstance.invoiceId !== null}
          />
        </Table.Cell>
        <Table.Cell
          onClick={() => {
            this.props.history.push(
              `${this.props.location.pathname}/product/${productInstance.id}`,
            );
          }}
          collapsing
        >
          <Icon name="list alternate outline" />
          {' '}
          {productName}
        </Table.Cell>
        <Table.Cell>
          {' '}
          {formatPriceFull(productInstance.basePrice)}
          {' '}
        </Table.Cell>
        <Table.Cell collapsing textAlign="right">
          {formatPriceDiscount(productInstance.discount)}
        </Table.Cell>
        <Table.Cell>
          {' '}
          {formatPriceFull(productInstance.basePrice - productInstance.discount)}
          {' '}
        </Table.Cell>
        <Table.Cell>
          {showRecentStatus(productInstance)}
        </Table.Cell>
      </Table.Row>
    );
  }
}

const mapStateToProps = (state: RootState, props: { productInstance: ProductInstance }) => {
  return {
    productName: getProductName(state, props.productInstance.productId),
  };
};

export default withRouter(connect(mapStateToProps)(ContractProductComponent));
