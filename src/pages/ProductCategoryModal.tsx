import * as React from 'react';
import {
  Dimmer,
  Header,
  Loader,
  Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { ProductCategory } from '../clients/server.generated';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import { TransientAlert } from '../stores/alerts/actions';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import ProductCategoryProps from '../components/entities/productcategories/ProductCategoryProps';
import { TitleContext } from '../components/TitleContext';
import { withRouter, WithRouter } from '../WithRouter';

interface Props extends WithTranslation, WithRouter {
  create?: boolean;
  category: ProductCategory | undefined;
  status: ResourceStatus;

  clearCategory: () => void;
  fetchCategory: (id: number) => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

class ProductCategoryModal extends React.Component<Props> {
  static defaultProps = {
    create: undefined,
  };

  componentDidMount() {
    this.props.clearCategory();
    const { params } = this.props.router;
    if (!this.props.create && params.categoryId !== undefined) {
      this.props.fetchCategory(parseInt(params.categoryId, 10));
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      category, status, t, create,
    } = this.props;

    if (create) {
      document.title = t('entities.category.newCategory');
    } else if (category === undefined) {
      document.title = t('entity.category');
    } else {
      document.title = category.name;
    }

    if (status === ResourceStatus.FETCHED
      && prevProps.status === ResourceStatus.SAVING
    ) {
      this.closeWithPopupMessage();
      this.props.showTransientAlert({
        title: 'Success',
        message: `Category ${category?.name} successfully saved`,
        type: 'success',
        displayTimeInMs: 3000,
      });
    }

    if (status === ResourceStatus.EMPTY
      && prevProps.status === ResourceStatus.DELETING
    ) {
      this.closeWithPopupMessage();
      showTransientAlert({
        title: 'Success',
        message: `Category ${prevProps.category?.name} successfully deleted`,
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
    let category: ProductCategory | undefined;
    if (this.props.create) {
      category = {
        id: 0,
        name: '',
      } as any as ProductCategory;
    } else {
      category = this.props.category;
    }
    const { t } = this.props;

    if (category === undefined) {
      return (
        <Modal
          onClose={this.close}
          closeIcon
          open
          dimmer="blurring"
          size="tiny"
          closeOnDimmerClick
        >
          <Modal.Content>
            <AlertContainer />
            <Dimmer active inverted>
              <Loader />
            </Dimmer>
          </Modal.Content>
        </Modal>
      );
    }

    return (
      <Modal
        onClose={this.close}
        open
        closeIcon
        dimmer="blurring"
        size="tiny"
      >
        <Modal.Content attached="bottom">
          <AlertContainer />
          <ProductCategoryProps
            category={category}
            create={this.props.create}
            onCancel={() => { }}
          />
          {
            category.products === undefined || category.products.length === 0 ? (
              <p>{t('entities.category.noProduct')}</p>
            ) : (
              <Segment>
                <Header>
                  {t('entity.products')}
                  :
                </Header>
                <ul>
                  {category.products.map((product) => {
                    return (
                      <li key={product.id}>
                        <NavLink to={`/product/${product.id}`}>{product.nameEnglish}</NavLink>
                      </li>
                    );
                  })}
                </ul>
              </Segment>
            )
          }
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    category: getSingle<ProductCategory>(state, SingleEntities.ProductCategory).data,
    status: getSingle<ProductCategory>(state, SingleEntities.ProductCategory).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  clearCategory: () => dispatch(clearSingle(SingleEntities.ProductCategory)),
  fetchCategory: (id: number) => dispatch(fetchSingle(SingleEntities.ProductCategory, id)),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

ProductCategoryModal.contextType = TitleContext;

export default withTranslation()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCategoryModal)),
);
