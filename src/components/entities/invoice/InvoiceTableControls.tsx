import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import TimeAgo from 'javascript-time-ago';
import { useTranslation } from 'react-i18next';
import { sortColumn } from '../../../stores/invoice/selectors';
import ResourceStatus from '../../../stores/resourceStatus';
import { RootState } from '../../../stores/store';
import TableControls from '../../TableControls';
import { fetchTable, searchTable } from '../../../stores/tables/actionCreators';
import { Tables } from '../../../stores/tables/tables';
import { Invoice } from '../../../clients/server.generated';
import { countFetched, countTotal, getTable } from '../../../stores/tables/selectors';
import { getLanguage } from '../../../localization';

interface Props {
  status: ResourceStatus;
  countFetched: number;
  countTotal: number;
  column: string;
  lastUpdated: Date;
  search: string;

  refresh: () => void;
  setSearch: (search: string) => void;

  lastSeenDate?: Date;
}

function InvoiceTableControls(props: Props) {
  const timeAgo = new TimeAgo(getLanguage());
  const { t } = useTranslation();

  const formatLastSeenDate = (): string => {
    return props.lastSeenDate
      ? t('pages.tables.invoices.lastSeenMessage', { timeAgo: timeAgo.format(props.lastSeenDate) })
      : t('pages.tables.invoices.lastSeenMessageNever');
  };

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
      bottomLine={formatLastSeenDate()}
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
    lastSeenDate: invoiceTable.lastSeen,
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
