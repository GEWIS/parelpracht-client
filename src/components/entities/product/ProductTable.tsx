import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Dimmer, Loader, Segment, Table,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Product } from '../../../clients/server.generated';
import TablePagination from '../../TablePagination';
import { RootState } from '../../../stores/store';
import {
  changeSortTable, fetchTable, nextPageTable, prevPageTable,
  setFilterTable, setSortTable, setTakeTable,
} from '../../../stores/tables/actionCreators';
import { countFetched, countTotal, getTable } from '../../../stores/tables/selectors';
import { Tables } from '../../../stores/tables/tables';
import ProductRow from './ProductRow';
import ProductStatusFilter from '../../tablefilters/ProductStatusFilter';
import ProductCategoryFilter from '../../tablefilters/ProductCategoryFilter';
import ResourceStatus from '../../../stores/resourceStatus';

interface Props {
  products: Product[];
  column: string;
  direction: 'ascending' | 'descending';
  total: number;
  fetched: number;
  skip: number;
  take: number;
  status: ResourceStatus;

  fetchProducts: () => void;
  changeSort: (column: string) => void;
  setSort: (column: string, direction: 'ASC' | 'DESC') => void;
  setTake: (take: number) => void;
  setTableFilter: (filter: { column: string, values: any[] }) => void;
  prevPage: () => void;
  nextPage: () => void;
}

function ProductsTable({
  products, fetchProducts, column, direction, changeSort, setSort, setTableFilter,
  total, fetched, skip, take, status,
  prevPage, nextPage, setTake,
}: Props) {
  useEffect(() => {
    setTableFilter({ column: 'status', values: ['ACTIVE'] });
    setSort('nameEnglish', 'ASC');
    fetchProducts();
  }, []);
  const { t } = useTranslation();

  const table = (
    <>
      <Table singleLine selectable attached sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'nameEnglish' ? direction : undefined}
              onClick={() => changeSort('nameEnglish')}
            >
              {t('entities.product.props.name')}
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'targetPrice' ? direction : undefined}
              onClick={() => changeSort('targetPrice')}
            >
              {t('entities.product.props.price')}
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'status' ? direction : undefined}
              onClick={() => changeSort('status')}
            >
              {t('entities.generalProps.status')}
              <ProductStatusFilter />
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'category' ? direction : undefined}
              onClick={() => changeSort('category')}
            >
              {t('entity.category')}
              <ProductCategoryFilter />
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

  if (status === ResourceStatus.FETCHING || status === ResourceStatus.SAVING) {
    return (
      <>
        <Segment style={{ padding: '0px' }}>
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
          {table}
        </Segment>
      </>
    );
  }

  return table;
}

const mapStateToProps = (state: RootState) => {
  const productTable = getTable<Product>(state, Tables.Products);
  return {
    total: countTotal(state, Tables.Products),
    fetched: countFetched(state, Tables.Products),
    status: productTable.status,
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
  setTableFilter: (filter: { column: string, values: any[] }) => {
    dispatch(setFilterTable(Tables.Products, filter));
  },
  changeSort: (column: string) => {
    dispatch(changeSortTable(Tables.Products, column));
    dispatch(fetchTable(Tables.Products));
  },
  setSort: (column: string, direction: 'ASC' | 'DESC') => {
    dispatch(setSortTable(Tables.Products, column, direction));
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
