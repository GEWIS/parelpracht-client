import React from 'react';
import { Table } from 'semantic-ui-react';
import { Product } from '../clients/server.generated';

interface Props {
  product: Product;
}

export function ProductRow(props: Props) {
  const { product } = props;
  return (
    <Table.Row>
      <Table.Cell>{product.nameDutch}</Table.Cell>
      <Table.Cell>
        {'€ '}
        {product.targetPrice}
      </Table.Cell>
    </Table.Row>
  );
}
