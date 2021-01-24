import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Icon, Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { ActivityType, ProductInstance } from '../../clients/server.generated';
// import './ContractComponent.scss';
import { RootState } from '../../stores/store';
import { getProductName } from '../../stores/product/selectors';
import { formatPriceDiscount, formatPriceFull } from '../../helpers/monetary';

interface Props extends RouteComponentProps {
  productInstance: ProductInstance;

  productName: string;
}

class InvoiceProductComponent extends React.Component<Props> {
  public render() {
    const {
      productInstance, productName,
    } = this.props;
    return (
      <Table.Row onClick={() => {
        this.props.history.push(
          `${this.props.location.pathname}/product/${productInstance.id}`,
        );
      }}
      >
        <Table.Cell collapsing>
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
      </Table.Row>
    );
  }
}

const mapStateToProps = (state: RootState, props: { productInstance: ProductInstance }) => {
  return {
    productName: getProductName(state, props.productInstance.productId),
  };
};

export default withRouter(connect(mapStateToProps)(InvoiceProductComponent));
