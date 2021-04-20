import * as React from 'react';
import { Modal } from 'semantic-ui-react';
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
import { clearSingle } from '../stores/single/actionCreators';
import { TransientAlert } from '../stores/alerts/actions';
import { showTransientAlert } from '../stores/alerts/actionCreators';

interface Props extends RouteComponentProps {
  status: ResourceStatus;

  clearProduct: () => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

class ProductCreatePage extends React.Component<Props> {
  componentDidMount() {
    this.props.clearProduct();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      this.props.history.push('/product');
      this.props.showTransientAlert({
        title: 'Success',
        message: 'Product successfully created',
        type: 'success',
        displayTimeInMs: 3000,
      });
    }
  }

  close = () => { this.props.history.goBack(); };

  public render() {
    const product: Product = {
      id: -1,
      nameDutch: '',
      nameEnglish: '',
      targetPrice: 0,
      status: ProductStatus.ACTIVE,
      description: '',
      categoryId: -1,
      contractTextDutch: '',
      contractTextEnglish: '',
      deliverySpecificationDutch: '',
      deliverySpecificationEnglish: '',
      minTarget: 0,
      maxTarget: 0,
    } as Product;

    return (
      <Modal
        onClose={this.close}
        open
        closeIcon
        dimmer="blurring"
        closeOnDimmerClick={false}
      >
        <Modal.Content>
          <AlertContainer />
          <ProductProps product={product} create onCancel={this.close} />
        </Modal.Content>
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
  clearProduct: () => dispatch(clearSingle(SingleEntities.Product)),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCreatePage));
