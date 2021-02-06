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

function ProductTableControls(props: Props) {
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
  const productTable = getTable<Product>(state, Tables.Products);
  return {
    status: productTable.status,
    countFetched: countFetched(state, Tables.Products),
    countTotal: countTotal(state, Tables.Products),
    column: sortColumn(state),
    lastUpdated: productTable.lastUpdated,
    search: productTable.search,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchTable(Tables.Products)),
  setSearch: (search: string) => {
    dispatch(searchTable(Tables.Products, search));
    dispatch(fetchTable(Tables.Products));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductTableControls);
