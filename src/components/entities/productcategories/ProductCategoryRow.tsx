import React from 'react';
import { Table } from 'semantic-ui-react';
import { ProductCategory } from '../../../clients/server.generated';
import CategoryLink from './ProductCategoryLink';

interface Props {
  category: ProductCategory;
}

function ProductCategoryRow(props: Props) {
  const { category } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <CategoryLink id={category.id} />
      </Table.Cell>
    </Table.Row>
  );
}

export default ProductCategoryRow;
