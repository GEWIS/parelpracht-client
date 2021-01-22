import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Product, ProductStatus } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';
import { getCategoryName } from '../../stores/productcategory/selectors';
import { RootState } from '../../stores/store';

interface Props {
  product: Product;
  categoryName: string;
}

function ProductRow(props: Props) {
  const { product, categoryName } = props;
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
      <Table.Cell>
        <NavLink to={`/category/${product.categoryId}`}>
          {categoryName}
        </NavLink>
      </Table.Cell>
    </Table.Row>
  );
}

const mapStateToProps = (state: RootState, props: { product: Product }) => {
  return {
    categoryName: getCategoryName(state, props.product.categoryId),
  };
};

export default connect(mapStateToProps)(ProductRow);
