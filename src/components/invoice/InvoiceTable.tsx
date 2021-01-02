import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Table } from 'semantic-ui-react';
import { Invoice } from '../../clients/server.generated';
import TablePagination from '../TablePagination';
import { RootState } from '../../stores/store';
import {
  changeSortTable, fetchTable, nextPageTable, prevPageTable, setTakeTable,
} from '../../stores/tables/actionCreators';
import { countFetched, countTotal, getTable } from '../../stores/tables/selectors';
import { Tables } from '../../stores/tables/tables';
import InvoiceRow from './InvoiceRow';
import InvoiceCompanyFilter from './filters/InvoiceCompanyFilter';

interface Props {
  invoices: Invoice[];
  column: string;
  direction: 'ascending' | 'descending';
  total: number;
  fetched: number;
  skip: number;
  take: number;

  fetchInvoices: () => void;
  changeSort: (column: string) => void;
  setTake: (take: number) => void;
  prevPage: () => void;
  nextPage: () => void;
}

function InvoicesTable({
  invoices, fetchInvoices, column, direction, changeSort,
  total, fetched, skip, take,
  prevPage, nextPage, setTake,
}: Props) {
  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <>
      <Table singleLine selectable attached sortable fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'invoiceId' ? direction : undefined}
              onClick={() => changeSort('invoiceId')}
            >
              Invoice Id
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'Company' ? direction : undefined}
              onClick={() => changeSort('Company')}
            >
              Company Name
              <InvoiceCompanyFilter />
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'Last updated' ? direction : undefined}
              onClick={() => changeSort('Last updated')}
            >
              Last Updated
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {invoices.map((x) => <InvoiceRow invoice={x} key={x.id} />)}
        </Table.Body>
      </Table>
      <TablePagination
        countTotal={total}
        countFetched={fetched}
        skip={skip}
        take={take}
        nextPage={nextPage}
        prevPage={prevPage}
        setTake={setTake}
      />
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const invoiceTable = getTable<Invoice>(state, Tables.Invoices);
  return {
    total: countTotal(state, Tables.Invoices),
    fetched: countFetched(state, Tables.Invoices),
    skip: invoiceTable.skip,
    take: invoiceTable.take,
    invoices: invoiceTable.data,
    column: invoiceTable.sortColumn,
    direction: invoiceTable.sortDirection === 'ASC'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchInvoices: () => dispatch(fetchTable(Tables.Invoices)),
  changeSort: (column: string) => {
    dispatch(changeSortTable(Tables.Invoices, column));
    dispatch(fetchTable(Tables.Invoices));
  },
  setTake: (take: number) => {
    dispatch(setTakeTable(Tables.Invoices, take));
    dispatch(fetchTable(Tables.Invoices));
  },
  prevPage: () => {
    dispatch(prevPageTable(Tables.Invoices));
    dispatch(fetchTable(Tables.Invoices));
  },
  nextPage: () => {
    dispatch(nextPageTable(Tables.Invoices));
    dispatch(fetchTable(Tables.Invoices));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoicesTable);
