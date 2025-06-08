import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { sortColumn } from '../../../stores/user/selectors';
import ResourceStatus from '../../../stores/resourceStatus';
import { RootState } from '../../../stores/store';
import TableControls from '../../TableControls';
import { fetchTable, searchTable } from '../../../stores/tables/actionCreators';
import { Tables } from '../../../stores/tables/tables';
import { User } from '../../../clients/server.generated';
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

function UserTableControls(props: Props) {
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
  const userTable = getTable<User>(state, Tables.Users);
  return {
    status: userTable.status,
    countFetched: countFetched(state, Tables.Users),
    countTotal: countTotal(state, Tables.Users),
    column: sortColumn(state),
    lastUpdated: userTable.lastUpdated,
    search: userTable.search,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchTable(Tables.Users)),
  setSearch: (search: string) => {
    dispatch(searchTable(Tables.Users, search));
    dispatch(fetchTable(Tables.Users));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserTableControls);
