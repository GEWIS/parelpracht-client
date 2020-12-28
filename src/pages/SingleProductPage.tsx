import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb,
  Container, Grid, Loader, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Product } from '../clients/server.generated';
import { RootState } from '../stores/store';
import ProductProps from '../components/product/ProductProps';
import ResourceStatus from '../stores/resourceStatus';
import ProductSummary from '../components/product/ProductSummary';
import ContractList from '../components/contract/ContractList';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';

interface Props extends RouteComponentProps<{ productId: string }> {
  product: Product | undefined;
  status: ResourceStatus;

  fetchProduct: (id: number) => void;
  clearProduct: () => void;
}

class SingleProductPage extends React.Component<Props> {
  componentDidMount() {
    const { productId } = this.props.match.params;

    this.props.clearProduct();
    this.props.fetchProduct(Number.parseInt(productId, 10));
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
            <Segment>
              <ProductProps product={product} />
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <ContractList />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    product: getSingle<Product>(state, SingleEntities.Product).data,
    status: getSingle<Product>(state, SingleEntities.Product).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProduct: (id: number) => dispatch(fetchSingle(SingleEntities.Product, id)),
  clearProduct: () => dispatch(clearSingle(SingleEntities.Product)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleProductPage));
