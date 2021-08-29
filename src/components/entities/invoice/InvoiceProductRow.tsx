import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Icon, Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ProductInstance, Roles } from '../../../clients/server.generated';
import { RootState } from '../../../stores/store';
import { getProductName } from '../../../stores/product/selectors';
import { formatPriceDiscount, formatPriceFull } from '../../../helpers/monetary';
import ContractLink from '../contract/ContractLink';
import DeleteButton from '../../DeleteButton';
import ResourceStatus from '../../../stores/resourceStatus';
import { TransientAlert } from '../../../stores/alerts/actions';
import { showTransientAlert } from '../../../stores/alerts/actionCreators';
import AuthorizationComponent from '../../AuthorizationComponent';

interface Props extends RouteComponentProps {
  productInstance: ProductInstance;
  removeProduct: (id: number) => void;
  canDelete: boolean;

  productName: string;
  showTransientAlert: (alert: TransientAlert) => void;
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
      this.props.showTransientAlert({
        title: 'Success',
        message: 'Deleted product from invoice successfully.',
        type: 'success',
        displayTimeInMs: 3000,
      });
    } catch {
      this.setState({ status: ResourceStatus.FETCHED });
      this.props.showTransientAlert({
        title: 'Error',
        message: 'Error deleting product from invoice.',
        type: 'error',
        displayTimeInMs: 1000,
      });
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
          {productInstance.details !== '' ? ` (${productInstance.details})` : ''}
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
          <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
            <DeleteButton remove={this.removeProduct} entity="InvoiceProduct" status={status} canDelete={canDelete} size="mini" color="red" />
          </AuthorizationComponent>
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InvoiceProductRow));
