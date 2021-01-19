import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Table } from 'semantic-ui-react';
import { Product } from '../../clients/server.generated';
import TablePagination from '../TablePagination';
import { RootState } from '../../stores/store';
import {
  changeSortTable, fetchTable, nextPageTable, prevPageTable, setTakeTable,
} from '../../stores/tables/actionCreators';
import { countFetched, countTotal, getTable } from '../../stores/tables/selectors';
import { Tables } from '../../stores/tables/tables';
import { ProductRow } from './ProductRow';
import ProductStatusFilter from '../tablefilters/ProductStatusFilter';

interface Props {
  products: Product[];
  column: string;
  direction: 'ascending' | 'descending';
  total: number;
  fetched: number;
  skip: number;
  take: number;

  fetchProducts: () => void;
  changeSort: (column: string) => void;
  setTake: (take: number) => void;
  prevPage: () => void;
  nextPage: () => void;
}

function ProductsTable({
  products, fetchProducts, column, direction, changeSort,
  total, fetched, skip, take,
  prevPage, nextPage, setTake,
}: Props) {
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
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
              <ProductStatusFilter />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {products.map((x) => <ProductRow product={x} key={x.id} />)}
        </Table.Body>
      </Table>
      <TablePagination
        countTotal={total}
        countFetched={fetched}
        skip={skip}
        take={take}
        nextPage={nextPage}
        prevPage={prevPage}
        setTake={setTake}
      />
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const productTable = getTable<Product>(state, Tables.Products);
  return {
    total: countTotal(state, Tables.Products),
    fetched: countFetched(state, Tables.Products),
    skip: productTable.skip,
    take: productTable.take,
    products: productTable.data,
    column: productTable.sortColumn,
    direction: productTable.sortDirection === 'ASC'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProducts: () => dispatch(fetchTable(Tables.Products)),
  changeSort: (column: string) => {
    dispatch(changeSortTable(Tables.Products, column));
    dispatch(fetchTable(Tables.Products));
  },
  setTake: (take: number) => {
    dispatch(setTakeTable(Tables.Products, take));
    dispatch(fetchTable(Tables.Products));
  },
  prevPage: () => {
    dispatch(prevPageTable(Tables.Products));
    dispatch(fetchTable(Tables.Products));
  },
  nextPage: () => {
    dispatch(nextPageTable(Tables.Products));
    dispatch(fetchTable(Tables.Products));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductsTable);
