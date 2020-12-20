import * as React from 'react';
import {
  Modal,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { Product, ProductStatus } from '../clients/server.generated';
import { fetchSingleProduct, clearSingleProduct } from '../stores/product/actionCreators';
import { RootState } from '../stores/store';
import ProductProps from './ProductProps';
import ResourceStatus from '../stores/resourceStatus';

interface Props extends RouteComponentProps {
  status: ResourceStatus;

  clearProduct: () => void;
}

class ProductCreate extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);

    props.clearProduct();
  }

  close = () => { this.props.history.push('/product'); };

  public render() {
    if (this.props.status === ResourceStatus.FETCHED) {
      return <Redirect to="/product" />;
    }

    const product: Product = {
      id: 0,
      nameDutch: '',
      nameEnglish: '',
      targetPrice: 0,
      status: ProductStatus.ACTIVE,
      description: '',
      contractTextDutch: '',
      contractTextEnglish: '',
      deliverySpecificationDutch: '',
      deliverySpecificationEnglish: '',
    } as Product;

    return (
      <Modal
        onClose={this.close}
        open
        dimmer="blurring"
        closeOnDimmerClick={false}
      >
        <ProductProps product={product} create onCancel={this.close} />
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: state.product.singleStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProduct: (id: number) => dispatch(fetchSingleProduct(id)),
  clearProduct: () => dispatch(clearSingleProduct()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCreate));
