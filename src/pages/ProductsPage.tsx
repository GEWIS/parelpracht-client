import * as React from 'react';
import { Button, Container, Icon } from 'semantic-ui-react';
import { ProductsTable } from '../product/ProductTable';

export default function ProductsPage() {
  return (
    <Container style={{ paddingTop: '7em' }}>
      <h1>Products</h1>
      <Button icon labelPosition="left" primary>
        <Icon name="plus" />
        Add product
      </Button>
      <ProductsTable />
    </Container>
  );
}
