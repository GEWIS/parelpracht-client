import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Dimmer, Loader, Segment, Table,
} from 'semantic-ui-react';
import { Invoice } from '../../clients/server.generated';
import TablePagination from '../TablePagination';
import { RootState } from '../../stores/store';
import {
  changeSortTable, fetchTable, nextPageTable, prevPageTable, setTakeTable,
} from '../../stores/tables/actionCreators';
import { countFetched, countTotal, getTable } from '../../stores/tables/selectors';
import { Tables } from '../../stores/tables/tables';
import InvoiceRow from './InvoiceRow';
import CompanyFilter from '../tablefilters/CompanyFilter';
import InvoiceStatusFilter from '../tablefilters/InvoiceStatusFilter';
import UserFilter from '../tablefilters/UserFilter';
import ResourceStatus from '../../stores/resourceStatus';

interface Props {
  invoices: Invoice[];
  column: string;
  direction: 'ascending' | 'descending';
  total: number;
  fetched: number;
  skip: number;
  take: number;
  status: ResourceStatus;

  fetchInvoices: () => void;
  changeSort: (column: string) => void;
  setTake: (take: number) => void;
  prevPage: () => void;
  nextPage: () => void;
}

function InvoicesTable({
  invoices, fetchInvoices, column, direction, changeSort,
  total, fetched, skip, take, status,
  prevPage, nextPage, setTake,
}: Props) {
  useEffect(() => {
    fetchInvoices();
  }, []);

  if (status === ResourceStatus.FETCHING || status === ResourceStatus.SAVING) {
    return (
      <>
        <Segment style={{ padding: '0px' }}>
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
          <Table singleLine selectable attached sortable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={column === 'title' ? direction : undefined}
                  onClick={() => changeSort('title')}
                >
                  Title
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'company' ? direction : undefined}
                  onClick={() => changeSort('company')}
                >
                  Company
                  <CompanyFilter table={Tables.Invoices} />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Status
                  <InvoiceStatusFilter />
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'startDate' ? direction : undefined}
                  onClick={() => changeSort('startDate')}
                >
                  Financial year
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'assignedTo' ? direction : undefined}
                  onClick={() => changeSort('assignedTo')}
                >
                  Assigned to
                  <UserFilter table={Tables.Invoices} />
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'updatedAt' ? direction : undefined}
                  onClick={() => changeSort('updatedAt')}
                >
                  Last Update
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
        </Segment>
      </>
    );
  }

  return (
    <>
      <Table singleLine selectable attached sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'title' ? direction : undefined}
              onClick={() => changeSort('title')}
            >
              Title
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'company' ? direction : undefined}
              onClick={() => changeSort('company')}
            >
              Company
              <CompanyFilter table={Tables.Invoices} />
            </Table.HeaderCell>
            <Table.HeaderCell>
              Amount
            </Table.HeaderCell>
            <Table.HeaderCell>
              Status
              <InvoiceStatusFilter />
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'startDate' ? direction : undefined}
              onClick={() => changeSort('startDate')}
            >
              Financial year
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'updatedAt' ? direction : undefined}
              onClick={() => changeSort('updatedAt')}
            >
              Last Update
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
    status: invoiceTable.status,
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
