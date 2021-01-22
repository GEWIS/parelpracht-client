import * as React from 'react';
import {
  Modal, Segment,
} from 'semantic-ui-react';
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
import ProductCategoryProps from '../components/product categories/ProductCategoryProps';

interface Props extends RouteComponentProps {
  status: ResourceStatus;

  clearCategory: () => void;
}

class ProductCategoriesCreatePage extends React.Component<Props> {
  componentDidMount() {
    this.props.clearCategory();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      this.close();
    }
  }

  close = () => { this.props.history.goBack(); };

  public render() {
    let category = new ProductCategory();
    category = {
      id: 0,
      name: '',
      version: 1,
      products: [],
    } as any as ProductCategory;

    return (
      <Modal
        onClose={this.close}
        open
        dimmer="blurring"
        closeOnDimmerClick={false}
      >
        <Segment>
          <AlertContainer />
          <ProductCategoryProps category={category} create onCancel={this.close} />
        </Segment>
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
});

// eslint-disable-next-line max-len
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCategoriesCreatePage));
