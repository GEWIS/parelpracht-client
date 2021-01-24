import * as React from 'react';
import {
  Dimmer,
  Header,
  Loader,
  Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { ProductCategory } from '../clients/server.generated';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import { TransientAlert } from '../stores/alerts/actions';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import ProductCategoryProps from '../components/productcategories/ProductCategoryProps';

interface Props extends RouteComponentProps<{ categoryId: string }> {
  create?: boolean;
  category: ProductCategory | undefined;
  status: ResourceStatus;

  clearCategory: () => void;
  fetchCategory: (id: number) => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

class ProductCategoryModal extends React.Component<Props> {
  componentDidMount() {
    this.props.clearCategory();

    const { categoryId } = this.props.match.params;
    if (!this.props.create && categoryId !== undefined) {
      this.props.fetchCategory(parseInt(categoryId, 10));
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.status === ResourceStatus.FETCHED
      && prevProps.status === ResourceStatus.SAVING
    ) {
      this.close();
    }

    if (this.props.status === ResourceStatus.EMPTY
      && prevProps.status === ResourceStatus.DELETING
    ) {
      this.close();
      // TODO: Fix alert not showing up, because it seems to get dismissed when closing the modal
      this.props.showTransientAlert({
        title: 'Success',
        message: `Category ${prevProps.category?.name} successfully deleted`,
        type: 'success',
      });
    }
  }

  close = () => {
    this.props.history.goBack();
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

    if (category === undefined) {
      return (
        <Modal
          onClose={this.close}
          closeIcon
          open
          dimmer="blurring"
          size="tiny"
        >
          <Segment placeholder attached="bottom">
            <AlertContainer />
            <Dimmer active inverted>
              <Loader />
            </Dimmer>
          </Segment>
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
        <Segment attached="bottom">
          <AlertContainer />
          <ProductCategoryProps
            category={category}
            create={this.props.create}
            onCancel={() => { }}
          />
          {
            category.products === undefined || category.products.length === 0 ? (
              <p>This category has no products</p>
            ) : (
              <Segment>
                <Header>Products:</Header>
                <ul>
                  {category.products.map((product) => {
                    return <li><NavLink to={`/product/${product.id}`}>{product.nameEnglish}</NavLink></li>;
                  })}
                </ul>
              </Segment>
            )
          }
        </Segment>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCategoryModal));
