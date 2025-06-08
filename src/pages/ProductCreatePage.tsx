import { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Product, ProductStatus, Roles } from '../clients/server.generated';
import { RootState } from '../stores/store';
import ProductProps from '../components/entities/product/ProductProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { SingleEntities } from '../stores/single/single';
import { getSingle } from '../stores/single/selectors';
import { clearSingle } from '../stores/single/actionCreators';
import { TransientAlert } from '../stores/alerts/actions';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import { TitleContext } from '../components/TitleContext';
import { withRouter, WithRouter } from '../WithRouter';

interface Props extends WithTranslation, WithRouter {
  status: ResourceStatus;

  clearProduct: () => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

class ProductCreatePage extends Component<Props> {
  componentDidMount() {
    const { clearProduct, t } = this.props;
    clearProduct();
    document.title = t('pages.product.newProduct');
  }

  componentDidUpdate(prevProps: Props) {
    const { navigate } = this.props.router;
    if (prevProps.status === ResourceStatus.SAVING && this.props.status === ResourceStatus.FETCHED) {
      navigate('/product');
      this.props.showTransientAlert({
        title: 'Success',
        message: 'Product successfully created',
        type: 'success',
        displayTimeInMs: 3000,
      });
    }
  }

  close = () => {
    const { navigate } = this.props.router;
    navigate(-1);
  };

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
      <Modal onClose={this.close} open closeIcon dimmer="blurring" closeOnDimmerClick={false}>
        <Modal.Content>
          <AlertContainer />
          <ProductProps
            product={product}
            create
            onCancel={this.close}
            canEdit={[Roles.ADMIN]}
            canDelete={[Roles.ADMIN]}
          />
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

ProductCreatePage.contextType = TitleContext;

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCreatePage)));
