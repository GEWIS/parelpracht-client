import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { sortColumn } from '../../stores/contract/selectors';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import TableControls from '../TableControls';
import { fetchTable, searchTable } from '../../stores/tables/actionCreators';
import { Tables } from '../../stores/tables/tables';
import { countFetched, countTotal, getTable } from '../../stores/tables/selectors';
import { ETCompany } from '../../helpers/extensiveTableObjects';

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

function ContractTableExtensiveControls(props: Props) {
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
  const contractTable = getTable<ETCompany>(state, Tables.ETContracts);
  return {
    status: contractTable.status,
    countFetched: countFetched(state, Tables.ETContracts),
    countTotal: countTotal(state, Tables.ETContracts),
    column: sortColumn(state),
    lastUpdated: contractTable.lastUpdated,
    search: contractTable.search,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchTable(Tables.ETContracts)),
  setSearch: (search: string) => {
    dispatch(searchTable(Tables.ETContracts, search));
    dispatch(fetchTable(Tables.ETContracts));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContractTableExtensiveControls);
