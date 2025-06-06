import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { sortColumnMegaTable } from '../../stores/company/selectors';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import TableControls from '../TableControls';
import { fetchTable, searchTable } from '../../stores/tables/actionCreators';
import { Tables } from '../../stores/tables/tables';
import { countFetched, countTotal, getTable } from '../../stores/tables/selectors';
import { ETCompany } from '../../clients/server.generated';

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

function MegaTableControls(props: Props) {
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
  const contractTable = getTable<ETCompany>(state, Tables.ETCompanies);
  return {
    status: contractTable.status,
    countFetched: countFetched(state, Tables.ETCompanies),
    countTotal: countTotal(state, Tables.ETCompanies),
    column: sortColumnMegaTable(state),
    lastUpdated: contractTable.lastUpdated,
    search: contractTable.search,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchTable(Tables.ETCompanies)),
  setSearch: (search: string) => {
    dispatch(searchTable(Tables.ETCompanies, search));
    dispatch(fetchTable(Tables.ETCompanies));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MegaTableControls);
