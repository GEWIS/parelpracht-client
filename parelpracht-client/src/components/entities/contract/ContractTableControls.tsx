import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { sortColumn } from '../../../stores/contract/selectors';
import ResourceStatus from '../../../stores/resourceStatus';
import { RootState } from '../../../stores/store';
import TableControls from '../../TableControls';
import { fetchTable, searchTable } from '../../../stores/tables/actionCreators';
import { Tables } from '../../../stores/tables/tables';
import { Contract } from '../../../clients/server.generated';
import { countFetched, countTotal, getTable } from '../../../stores/tables/selectors';

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

function ContractTableControls(props: Props) {
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
  const contractTable = getTable<Contract>(state, Tables.Contracts);
  return {
    status: contractTable.status,
    countFetched: countFetched(state, Tables.Contracts),
    countTotal: countTotal(state, Tables.Contracts),
    column: sortColumn(state),
    lastUpdated: contractTable.lastUpdated,
    search: contractTable.search,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchTable(Tables.Contracts)),
  setSearch: (search: string) => {
    dispatch(searchTable(Tables.Contracts, search));
    dispatch(fetchTable(Tables.Contracts));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContractTableControls);
