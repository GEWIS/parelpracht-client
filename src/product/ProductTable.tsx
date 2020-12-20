import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Table } from 'semantic-ui-react';
import { Product } from '../clients/server.generated';
import TablePagination from '../components/TablePagination';
import {
  fetchProducts as createFetchProducts, changeSortProducts,
  setTakeProducts, prevPageProducts, nextPageProducts,
} from '../stores/product/actionCreators';
import { countFetchedProducts, countTotalProducts } from '../stores/product/selectors';
import { RootState } from '../stores/store';
import { ProductRow } from './ProductRow';

interface Props {
  products: Product[];
  column: string;
  direction: 'ascending' | 'descending';
  countTotal: number;
  countFetched: number;
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
  countTotal, countFetched, skip, take,
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
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {products.map((x) => <ProductRow product={x} key={x.id} />)}
        </Table.Body>
      </Table>
      <TablePagination
        countTotal={countTotal}
        countFetched={countFetched}
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
  return {
    countTotal: countTotalProducts(state),
    countFetched: countFetchedProducts(state),
    skip: state.product.listSkip,
    take: state.product.listTake,
    products: state.product.list,
    column: state.product.listSortColumn,
    direction: state.product.listSortDirection === 'ASC'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProducts: () => dispatch(createFetchProducts()),
  changeSort: (column: string) => {
    dispatch(changeSortProducts(column));
    dispatch(createFetchProducts());
  },
  setTake: (take: number) => {
    dispatch(setTakeProducts(take));
    dispatch(createFetchProducts());
  },
  prevPage: () => {
    dispatch(prevPageProducts());
    dispatch(createFetchProducts());
  },
  nextPage: () => {
    dispatch(nextPageProducts());
    dispatch(createFetchProducts());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductsTable);
