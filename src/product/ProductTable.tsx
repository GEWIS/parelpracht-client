import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Table } from 'semantic-ui-react';
import { Product } from '../clients/server.generated';
import { fetchProducts as createFetchProducts, changeSortProducts } from '../stores/product/actionCreators';
import { RootState } from '../stores/store';
import { ProductRow } from './ProductRow';

interface Props {
  products: Product[];
  column: string;
  direction: 'ascending' | 'descending';

  fetchProducts: () => void;
  changeSort: (column: string) => void;
}

function ProductsTable({
  products, fetchProducts, column, direction, changeSort,
}: Props) {
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Table singleLine selectable attached sortable fixed>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            sorted={column === 'nameDutch' ? direction : undefined}
            onClick={() => changeSort('nameDutch')}
          >
            Name (Dutch)
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={column === 'nameEnglish' ? direction : undefined}
            onClick={() => changeSort('nameEnglish')}
          >
            Name (English)
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={column === 'targetPrice' ? direction : undefined}
            onClick={() => changeSort('targetPrice')}
          >
            Target price
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={column === 'status' ? direction : undefined}
            onClick={() => changeSort('status')}
          >
            Status
          </Table.HeaderCell>
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
    column: state.product.listSortColumn,
    direction: state.product.listSortDirection === 'asc'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProducts: () => dispatch(createFetchProducts()),
  changeSort: (column: string) => dispatch(changeSortProducts(column)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductsTable);
