import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Table } from 'semantic-ui-react';
import { Product } from '../clients/server.generated';
import { fetchProducts as createFetchProducts } from '../stores/product/actionCreators';
import { RootState } from '../stores/store';
import { ProductRow } from './ProductRow';

interface Props {
  products: Product[];

  fetchProducts: () => void;
}

function ProductsTable({ products, fetchProducts }: Props) {
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Table singleLine selectable attached>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name (Dutch)</Table.HeaderCell>
          <Table.HeaderCell>Name (English)</Table.HeaderCell>
          <Table.HeaderCell>Target price</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {products.map((x) => <ProductRow product={x} key={x.id} />)}
      </Table.Body>
    </Table>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    products: state.product.list,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProducts: () => dispatch(createFetchProducts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductsTable);
