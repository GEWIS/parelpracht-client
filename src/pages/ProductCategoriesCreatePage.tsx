import { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ProductCategory } from '../clients/server.generated';
import { clearSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import ProductCategoryProps from '../components/entities/productcategories/ProductCategoryProps';
import { TransientAlert } from '../stores/alerts/actions';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import { withRouter, WithRouter } from '../WithRouter';

interface Props extends WithRouter {
  status: ResourceStatus;

  clearCategory: () => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

class ProductCategoriesCreatePage extends Component<Props> {
  componentDidMount() {
    this.props.clearCategory();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING && this.props.status === ResourceStatus.FETCHED) {
      this.closeWithPopupMessage();
      this.props.showTransientAlert({
        title: 'Success',
        message: 'Category successfully created',
        type: 'success',
        displayTimeInMs: 3000,
      });
    }
  }

  closeWithPopupMessage = () => {
    const { navigate } = this.props.router;
    navigate('/category');
  };

  close = () => {
    const { navigate } = this.props.router;
    navigate(-1);
  };

  public render() {
    const category = {
      id: 0,
      name: '',
      products: [],
    } as unknown as ProductCategory;

    return (
      <Modal size="tiny" onClose={this.close} open closeIcon dimmer="blurring" closeOnDimmerClick={false}>
        <Modal.Content>
          <AlertContainer />
          <ProductCategoryProps category={category} create onCancel={this.close} />
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<ProductCategory>(state, SingleEntities.ProductCategory).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  clearCategory: () => dispatch(clearSingle(SingleEntities.ProductCategory)),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCategoriesCreatePage));
