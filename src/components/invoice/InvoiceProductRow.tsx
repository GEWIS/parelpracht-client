import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Icon, Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { ProductInstance } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { getProductName } from '../../stores/product/selectors';
import { formatPriceDiscount, formatPriceFull } from '../../helpers/monetary';
import ContractLink from '../contract/ContractLink';
import DeleteButton from '../DeleteButton';
import ResourceStatus from '../../stores/resourceStatus';

interface Props extends RouteComponentProps {
  productInstance: ProductInstance;
  removeProduct: (id: number) => void;
  canDelete: boolean;

  productName: string;
}

interface State {
  status: ResourceStatus;
}

class InvoiceProductRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      status: ResourceStatus.FETCHED,
    };
  }

  removeProduct = async () => {
    const { removeProduct } = this.props;
    this.setState({ status: ResourceStatus.DELETING });
    try {
      await removeProduct(this.props.productInstance.id);
    } catch {
      // TODO: show error alert
      this.setState({ status: ResourceStatus.FETCHED });
    }
  };

  public render() {
    const {
      productInstance, productName, canDelete,
    } = this.props;
    const { status } = this.state;
    return (
      <Table.Row>
        <Table.Cell>
          <Icon name="shopping bag" />
          {' '}
          {productName}
          {productInstance.comments !== '' ? ` (${productInstance.comments})` : ''}
        </Table.Cell>
        <Table.Cell collapsing>
          {formatPriceDiscount(productInstance.discount)}
        </Table.Cell>
        <Table.Cell collapsing>
          {formatPriceFull(productInstance.basePrice - productInstance.discount)}
        </Table.Cell>
        <Table.Cell collapsing>
          <ContractLink id={productInstance.contractId} showId showName={false} />
        </Table.Cell>
        <Table.Cell collapsing>
          <DeleteButton remove={this.removeProduct} entity="InvoiceProduct" status={status} canDelete={canDelete} size="mini" color="red" />
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
