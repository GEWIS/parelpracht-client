import * as React from 'react';
import {
  Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Product, ProductStatus } from '../clients/server.generated';
import { RootState } from '../stores/store';
import ProductProps from '../components/product/ProductProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { SingleEntities } from '../stores/single/single';
import { getSingle } from '../stores/single/selectors';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';

interface Props extends RouteComponentProps {
  status: ResourceStatus;

  clearProduct: () => void;
}

class ProductCreatePage extends React.Component<Props> {
  componentDidMount() {
    this.props.clearProduct();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      this.close();
    }
  }

  close = () => { this.props.history.goBack(); };

  public render() {
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
        <Segment>
          <AlertContainer />
          <ProductProps product={product} create onCancel={this.close} />
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<Product>(state, SingleEntities.Product).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProduct: (id: number) => dispatch(fetchSingle(SingleEntities.Product, id)),
  clearProduct: () => dispatch(clearSingle(SingleEntities.Product)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCreatePage));
