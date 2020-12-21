import React from 'react';
import { connect } from 'react-redux';
import {
  Grid, Header, Icon, Loader, Placeholder, Segment,
} from 'semantic-ui-react';
import { Product } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';

interface Props {
  product: Product | undefined;
  status: ResourceStatus;
}

function ProductSummary(props: Props) {
  const { product, status } = props;
  if (product === undefined
    || (status !== ResourceStatus.FETCHED
      && status !== ResourceStatus.SAVING
      && status !== ResourceStatus.ERROR)) {
    return (
      <>
        <Header as="h1" attached="top" inverted>
          <Icon name="shopping bag" />
          <Header.Content>
            <Header.Subheader>Product</Header.Subheader>
            <Loader active inline />
          </Header.Content>
        </Header>
        <Segment attached="bottom">
          <Placeholder><Placeholder.Line length="long" /></Placeholder>
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
          {product.nameDutch}
        </Header.Content>
      </Header>
      <Segment attached="bottom">
        <Grid columns={4}>
          <Grid.Column>
            <h5>Name (English)</h5>
            <p>{product.nameEnglish}</p>
          </Grid.Column>
          <Grid.Column>
            <h5>Target price</h5>
            <p>{formatPriceFull(product.targetPrice)}</p>
          </Grid.Column>
          <Grid.Column>
            <h5>Created by</h5>
          </Grid.Column>
        </Grid>
      </Segment>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    product: state.product.single,
    status: state.product.singleStatus,
  };
};

export default connect(mapStateToProps)(ProductSummary);
