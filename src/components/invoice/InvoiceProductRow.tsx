import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Icon, Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { ActivityType, ProductInstance } from '../../clients/server.generated';
// import './ContractComponent.scss';
import { RootState } from '../../stores/store';
import { getProductName } from '../../stores/product/selectors';
import { formatPriceDiscount, formatPriceFull } from '../../helpers/monetary';
import ContractLink from '../contract/ContractLink';

interface Props extends RouteComponentProps {
  productInstance: ProductInstance;

  productName: string;
}

class InvoiceProductRow extends React.Component<Props> {
  public render() {
    const {
      productInstance, productName,
    } = this.props;
    return (
      <Table.Row>
        <Table.Cell collapsing>
          <Icon name="shopping bag" />
          {' '}
          {productName}
          {productInstance.comments !== '' ? ` (${productInstance.comments})` : ''}
        </Table.Cell>
        <Table.Cell collapsing>
          {formatPriceDiscount(productInstance.discount)}
        </Table.Cell>
        <Table.Cell>
          {formatPriceFull(productInstance.basePrice - productInstance.discount)}
        </Table.Cell>
        <Table.Cell>
          <ContractLink id={productInstance.contractId} showId showName={false} />
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

export default withRouter(connect(mapStateToProps)(InvoiceProductRow));
