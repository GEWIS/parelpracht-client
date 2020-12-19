import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Container, Dimmer, Grid, Loader,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
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

class SingleProductPage extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
    const { productId } = props.match.params;

    props.clearProduct();
    props.fetchProduct(Number.parseInt(productId, 10));
  }

  public render() {
    const { status, product } = this.props;

    if (status !== ResourceStatus.FETCHED || product === undefined) {
      return (
        <Container style={{ paddingTop: '7em' }}>
          <Loader content="Loading" active />
        </Container>
      );
    }

    return (
      <Container style={{ paddingTop: '7em' }}>
        <h1>{product.nameDutch}</h1>
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
