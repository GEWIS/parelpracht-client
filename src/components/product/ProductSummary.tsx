import React from 'react';
import { connect } from 'react-redux';
import {
  Grid, Header, Icon, Loader, Placeholder, Segment,
} from 'semantic-ui-react';
import { Product } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';
import ResourceStatus from '../../stores/resourceStatus';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import { getCategoryName } from '../../stores/productcategory/selectors';

interface Props {
  product: Product | undefined;
  status: ResourceStatus;
  categoryName: string;
}

function ProductSummary(props: Props) {
  const { product, status, categoryName } = props;
  if (product === undefined) {
    return (
      <>
        <Header as="h1" attached="top" style={{ backgroundColor: '#eee' }}>
          <Loader active inline style={{ marginRight: '1rem', marginLeft: '1rem', marginTop: '0.5rem' }} />
          <Header.Content>
            <Header.Subheader>Product</Header.Subheader>
          </Header.Content>
        </Header>
        <Segment attached="bottom">
          <Placeholder><Placeholder.Line length="long" /></Placeholder>
        </Segment>
      </>
    );
  }

  if (status === ResourceStatus.FETCHING || status === ResourceStatus.SAVING) {
    return (
      <>
        <Header as="h1" attached="top" style={{ backgroundColor: '#eee' }}>
          <Loader active inline style={{ marginRight: '0.95rem', marginLeft: '1rem', marginTop: '0.5rem' }} />
          <Header.Content>
            <Header.Subheader>Product</Header.Subheader>
            {product.nameEnglish}
          </Header.Content>
        </Header>
        <Segment attached="bottom">
          <Grid columns={4}>
            <Grid.Column>
              <h5>Name</h5>
              <p>{product.nameEnglish}</p>
            </Grid.Column>
            <Grid.Column>
              <h5>Target price</h5>
              <p>{formatPriceFull(product.targetPrice)}</p>
            </Grid.Column>
            <Grid.Column>
              <h5>Category</h5>
              <p>{categoryName}</p>
            </Grid.Column>
          </Grid>
        </Segment>
      </>
    );
  }

  return (
    <>
      <Header as="h1" attached="top" style={{ backgroundColor: '#eee' }}>
        <Icon name="shopping bag" />
        <Header.Content>
          <Header.Subheader>Product</Header.Subheader>
          {product.nameEnglish}
        </Header.Content>
      </Header>
      <Segment attached="bottom">
        <Grid columns={4}>
          <Grid.Column>
            <h5>Name</h5>
            <p>{product.nameEnglish}</p>
          </Grid.Column>
          <Grid.Column>
            <h5>Target price</h5>
            <p>{formatPriceFull(product.targetPrice)}</p>
          </Grid.Column>
          <Grid.Column>
            <h5>Category</h5>
            <p>{categoryName}</p>
          </Grid.Column>
        </Grid>
      </Segment>
    </>
  );
}

const mapStateToProps = (state: RootState, props: { product: Product }) => {
  return {
    product: getSingle<Product>(state, SingleEntities.Product).data,
    status: getSingle<Product>(state, SingleEntities.Product).status,
    categoryName: getCategoryName(state, props.product.categoryId),
  };
};

export default connect(mapStateToProps)(ProductSummary);
