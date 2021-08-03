import * as React from 'react';
import { Modal } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
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

interface Props extends RouteComponentProps {
  status: ResourceStatus;

  clearCategory: () => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

class ProductCategoriesCreatePage extends React.Component<Props> {
  componentDidMount() {
    this.props.clearCategory();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
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
    this.props.history.push('/category');
  };

  close = () => { this.props.history.goBack(); };

  public render() {
    const category = {
      id: 0,
      name: '',
      products: [],
    } as any as ProductCategory;

    return (
      <Modal
        size="tiny"
        onClose={this.close}
        open
        closeIcon
        dimmer="blurring"
        closeOnDimmerClick={false}
      >
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

// eslint-disable-next-line max-len
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCategoriesCreatePage));
