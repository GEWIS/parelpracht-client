import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { sortColumn } from '../../stores/product/selectors';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import TableControls from '../TableControls';
import { fetchTable, searchTable } from '../../stores/tables/actionCreators';
import { Tables } from '../../stores/tables/tables';
import { Product } from '../../clients/server.generated';
import { countFetched, countTotal, getTable } from '../../stores/tables/selectors';

interface Props {
  status: ResourceStatus;
  countFetched: number;
  countTotal: number;
  column: string;
  lastUpdated: Date;
  search: string;

  refresh: () => void;
  setSearch: (search: string) => void;
}

function ProductCategoriesTableControls(props: Props) {
  return (
    <TableControls
      status={props.status}
      countFetched={props.countFetched}
      countTotal={props.countTotal}
      column={props.column}
      lastUpdated={props.lastUpdated}
      search={props.search}
      refresh={props.refresh}
      setSearch={props.setSearch}
    />
  );
}

const mapStateToProps = (state: RootState) => {
  const productCategoriesTable = getTable<Product>(state, Tables.ProductCategories);
  return {
    status: productCategoriesTable.status,
    countFetched: countFetched(state, Tables.ProductCategories),
    countTotal: countTotal(state, Tables.ProductCategories),
    column: sortColumn(state),
    lastUpdated: productCategoriesTable.lastUpdated,
    search: productCategoriesTable.search,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchTable(Tables.ProductCategories)),
  setSearch: (search: string) => {
    dispatch(searchTable(Tables.ProductCategories, search));
    dispatch(fetchTable(Tables.ProductCategories));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductCategoriesTableControls);
