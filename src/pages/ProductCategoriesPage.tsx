import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import ProductCategoriesTable from '../components/product categories/ProductCategoriesTable';
import ProductCategoriesTableControls from '../components/product categories/ProductCategoriesTableControls';

function ProductCategoriesPage(props: RouteComponentProps) {
  return (
    <>
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '2em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="shopping bag" />
                <Header.Content>
                  <Header.Subheader>Categories</Header.Subheader>
                  Product Categories
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Button icon labelPosition="left" primary floated="right" onClick={() => props.history.push('/category/new')}>
                <Icon name="plus" />
                Add Category
              </Button>
            </Grid.Column>
          </Grid>

          <ProductCategoriesTableControls />

        </Container>
      </Segment>
      <Container>
        <ProductCategoriesTable />
      </Container>
    </>
  );
}

export default withRouter(ProductCategoriesPage);
