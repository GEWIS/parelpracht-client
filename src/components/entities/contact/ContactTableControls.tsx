import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { sortColumn } from '../../../stores/contact/selectors';
import ResourceStatus from '../../../stores/resourceStatus';
import { RootState } from '../../../stores/store';
import TableControls from '../../TableControls';
import { fetchTable, searchTable } from '../../../stores/tables/actionCreators';
import { Tables } from '../../../stores/tables/tables';
import { Contact } from '../../../clients/server.generated';
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

function ContactTableControls(props: Props) {
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
  const contactTable = getTable<Contact>(state, Tables.Contacts);
  return {
    status: contactTable.status,
    countFetched: countFetched(state, Tables.Contacts),
    countTotal: countTotal(state, Tables.Contacts),
    column: sortColumn(state),
    lastUpdated: contactTable.lastUpdated,
    search: contactTable.search,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchTable(Tables.Contacts)),
  setSearch: (search: string) => {
    dispatch(searchTable(Tables.Contacts, search));
    dispatch(fetchTable(Tables.Contacts));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactTableControls);
