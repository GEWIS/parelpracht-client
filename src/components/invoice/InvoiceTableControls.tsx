import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { sortColumn } from '../../stores/invoice/selectors';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import TableControls from '../TableControls';
import { fetchTable, searchTable } from '../../stores/tables/actionCreators';
import { Tables } from '../../stores/tables/tables';
import { Invoice } from '../../clients/server.generated';
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

function InvoiceTableControls(props: Props) {
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
  const invoiceTable = getTable<Invoice>(state, Tables.Invoices);
  return {
    status: invoiceTable.status,
    countFetched: countFetched(state, Tables.Invoices),
    countTotal: countTotal(state, Tables.Invoices),
    column: sortColumn(state),
    lastUpdated: invoiceTable.lastUpdated,
    search: invoiceTable.search,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchTable(Tables.Invoices)),
  setSearch: (search: string) => {
    dispatch(searchTable(Tables.Invoices, search));
    dispatch(fetchTable(Tables.Invoices));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceTableControls);
