import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb,
  Container, Grid, Loader,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Product } from '../clients/server.generated';
import { fetchSingleProduct, clearSingleProduct } from '../stores/product/actionCreators';
import { RootState } from '../stores/store';
import ProductProps from '../product/ProductProps';
import ResourceStatus from '../stores/resourceStatus';
import ProductSummary from '../product/ProductSummary';

interface Props extends RouteComponentProps<{ productId: string }> {
  product: Product | undefined;
  status: ResourceStatus;

  fetchProduct: (id: number) => void;
  clearProduct: () => void;
}

class SingleProductPage extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
    const { productId } = props.match.params;

    props.clearProduct();
    props.fetchProduct(Number.parseInt(productId, 10));
  }

  public render() {
    const { product } = this.props;

    if (product === undefined) {
      return (
        <Container style={{ paddingTop: '2em' }}>
          <Loader content="Loading" active />
        </Container>
      );
    }

    return (
      <Container style={{ paddingTop: '2em' }}>
        <Breadcrumb
          icon="right angle"
          sections={[
            { key: 'Products', content: <NavLink to="/product">Products</NavLink> },
            { key: 'Product', content: product.nameDutch, active: true },
          ]}
        />
        <ProductSummary />
        <Grid columns={2}>
          <Grid.Column>
            <ProductProps product={product} />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    product: state.product.single,
    status: state.product.singleStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProduct: (id: number) => dispatch(fetchSingleProduct(id)),
  clearProduct: () => dispatch(clearSingleProduct()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleProductPage));
