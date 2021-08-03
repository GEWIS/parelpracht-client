import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { Roles } from '../clients/server.generated';
import AuthorizationComponent from '../components/AuthorizationComponent';
import ProductsTable from '../components/entities/product/ProductTable';
import ProductTableControls from '../components/entities/product/ProductTableControls';

function ProductsPage(props: RouteComponentProps) {
  return (
    <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
      <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
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
      <Container style={{ marginTop: '20px' }}>
        <ProductsTable />
      </Container>
    </AuthorizationComponent>
  );
}

export default withRouter(ProductsPage);
