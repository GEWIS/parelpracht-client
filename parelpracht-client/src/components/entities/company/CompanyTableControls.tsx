import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { fetchTable, searchTable } from '../../../stores/tables/actionCreators';
import ResourceStatus from '../../../stores/resourceStatus';
import { RootState } from '../../../stores/store';
import TableControls from '../../TableControls';
import { Tables } from '../../../stores/tables/tables';
import { countFetched, countTotal, getTable } from '../../../stores/tables/selectors';
import { Company } from '../../../clients/server.generated';
import { sortColumn } from '../../../stores/company/selectors';

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

function CompanyTableControls(props: Props) {
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
  const companyTable = getTable<Company>(state, Tables.Companies);
  return {
    status: companyTable.status,
    countFetched: countFetched(state, Tables.Companies),
    countTotal: countTotal(state, Tables.Companies),
    column: sortColumn(state),
    lastUpdated: companyTable.lastUpdated,
    search: companyTable.search,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchTable(Tables.Companies)),
  setSearch: (search: string) => {
    dispatch(searchTable(Tables.Companies, search));
    dispatch(fetchTable(Tables.Companies));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CompanyTableControls);
