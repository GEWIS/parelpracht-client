import React from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Product, ProductStatus } from '../clients/server.generated';
import { formatPriceFull } from '../helpers/monetary';

interface Props {
  product: Product;
}

export function ProductRow(props: Props) {
  const { product } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/product/${product.id}`}>
          {product.nameDutch}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <NavLink to={`/product/${product.id}`}>
          {product.nameEnglish}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        {formatPriceFull(product.targetPrice)}
      </Table.Cell>
      <Table.Cell>
        {product.status === ProductStatus.ACTIVE ? 'Active' : 'Inactive'}
      </Table.Cell>
    </Table.Row>
  );
}
