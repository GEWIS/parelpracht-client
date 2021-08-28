import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Dimmer, Loader, Segment, Table,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { ProductCategory } from '../../../clients/server.generated';
import TablePagination from '../../TablePagination';
import { RootState } from '../../../stores/store';
import {
  changeSortTable, fetchTable, nextPageTable, prevPageTable, setTakeTable,
} from '../../../stores/tables/actionCreators';
import { countFetched, countTotal, getTable } from '../../../stores/tables/selectors';
import { Tables } from '../../../stores/tables/tables';
import ProductCategoryRow from './ProductCategoryRow';
import ResourceStatus from '../../../stores/resourceStatus';

interface Props {
  categories: ProductCategory[];
  column: string;
  direction: 'ascending' | 'descending';
  total: number;
  fetched: number;
  skip: number;
  take: number;
  status: ResourceStatus;

  fetchCategories: () => void;
  changeSort: (column: string) => void;
  setTake: (take: number) => void;
  prevPage: () => void;
  nextPage: () => void;
}

function ProductCategoriesTable({
  categories, fetchCategories, column, direction, changeSort,
  total, fetched, skip, take, status,
  prevPage, nextPage, setTake,
}: Props) {
  useEffect(() => {
    fetchCategories();
  }, []);
  const { t } = useTranslation();

  const table = (
    <>
      <Table singleLine selectable attached sortable fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'name' ? direction : undefined}
              onClick={() => changeSort('name')}
            >
              {t('entities.category.props.name')}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((x) => <ProductCategoryRow category={x} key={x.id} />)}
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
  const categoryTable = getTable<ProductCategory>(state, Tables.ProductCategories);
  return {
    total: countTotal(state, Tables.ProductCategories),
    fetched: countFetched(state, Tables.ProductCategories),
    status: categoryTable.status,
    skip: categoryTable.skip,
    take: categoryTable.take,
    categories: categoryTable.data,
    column: categoryTable.sortColumn,
    direction: categoryTable.sortDirection === 'ASC'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCategories: () => dispatch(fetchTable(Tables.ProductCategories)),
  changeSort: (column: string) => {
    dispatch(changeSortTable(Tables.ProductCategories, column));
    dispatch(fetchTable(Tables.ProductCategories));
  },
  setTake: (take: number) => {
    dispatch(setTakeTable(Tables.ProductCategories, take));
    dispatch(fetchTable(Tables.ProductCategories));
  },
  prevPage: () => {
    dispatch(prevPageTable(Tables.ProductCategories));
    dispatch(fetchTable(Tables.ProductCategories));
  },
  nextPage: () => {
    dispatch(nextPageTable(Tables.ProductCategories));
    dispatch(fetchTable(Tables.ProductCategories));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductCategoriesTable);
