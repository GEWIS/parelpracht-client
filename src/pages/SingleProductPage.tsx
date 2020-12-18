import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { Product } from '../clients/server.generated';
import { fetchSingleProduct, clearSingleProduct } from '../stores/product/actionCreators';
import { RootState } from '../stores/store';
import { ProductProps } from '../product/ProductProps';
import ResourceStatus from '../stores/resourceStatus';

interface Props extends RouteComponentProps<{ productId: string }> {
  product: Product | undefined;
  status: ResourceStatus;

  fetchProduct: (id: number) => void;
  clearProduct: () => void;
}

function SingleProductPage({
  match, product, fetchProduct, clearProduct, status,
}: Props) {
  useEffect(() => {
    const { productId } = match.params;
    clearProduct();
    fetchProduct(Number.parseInt(productId, 10));
  }, []);

  console.log(`${status}: ${product?.nameDutch}`);
  let title = 'Product';
  if (status === ResourceStatus.FETCHED && product !== undefined) {
    title = product.nameDutch;
  }

  return (
    <Container style={{ paddingTop: '7em' }}>
      <h1>{title}</h1>
      <Grid columns={2}>
        <Grid.Column>
          <ProductProps product={product} status={status} />
        </Grid.Column>
      </Grid>
    </Container>
  );
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
