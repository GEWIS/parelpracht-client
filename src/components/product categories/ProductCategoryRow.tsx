import React from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { ProductCategory } from '../../clients/server.generated';

interface Props {
  category: ProductCategory;
}

function ProductCategoryRow(props: Props) {
  const { category } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/category/${category.id}`}>
          { category.name }
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        { category.products }
      </Table.Cell>
    </Table.Row>
  );
}

export default ProductCategoryRow;
