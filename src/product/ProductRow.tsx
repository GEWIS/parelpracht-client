import React from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Product } from '../clients/server.generated';

interface Props {
  product: Product;
}

export function ProductRow(props: Props) {
  const { product } = props;
  return (
    <Table.Row>
      <Table.Cell selectable>
        <NavLink to={`/product/${product.id}`}>
          {product.nameDutch}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        {'€ '}
        {product.targetPrice}
      </Table.Cell>
    </Table.Row>
  );
}
