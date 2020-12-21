import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import ProductsTable from '../components/product/ProductTable';
import ProductTableControls from '../components/product/ProductTableControls';

function ProductsPage(props: RouteComponentProps) {
  return (
    <>
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '2em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="shopping bag" />
                <Header.Content>
                  <Header.Subheader>Products</Header.Subheader>
                  All Products
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Button icon labelPosition="left" primary floated="right" onClick={() => props.history.push('/product/new')}>
                <Icon name="plus" />
                Add Product
              </Button>
            </Grid.Column>
          </Grid>

          <ProductTableControls />

        </Container>
      </Segment>
      <Container>
        <ProductsTable />
      </Container>
    </>
  );
}

export default withRouter(ProductsPage);
