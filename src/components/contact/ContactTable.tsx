import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Dimmer, Loader, Segment, Table,
} from 'semantic-ui-react';
import { Contact } from '../../clients/server.generated';
import TablePagination from '../TablePagination';
import { RootState } from '../../stores/store';
import {
  changeSortTable, fetchTable, nextPageTable, prevPageTable, setTakeTable,
} from '../../stores/tables/actionCreators';
import { countFetched, countTotal, getTable } from '../../stores/tables/selectors';
import { Tables } from '../../stores/tables/tables';
import ContactRow from './ContactRow';
import ContactCompanyFilter from '../tablefilters/CompanyFilter';
import ResourceStatus from '../../stores/resourceStatus';

interface Props {
  contacts: Contact[];
  column: string;
  direction: 'ascending' | 'descending';
  total: number;
  fetched: number;
  skip: number;
  take: number;
  status: ResourceStatus;

  fetchContacts: () => void;
  changeSort: (column: string) => void;
  setTake: (take: number) => void;
  prevPage: () => void;
  nextPage: () => void;
}

function ContactsTable({
  contacts, fetchContacts, column, direction, changeSort,
  total, fetched, skip, take, status,
  prevPage, nextPage, setTake,
}: Props) {
  useEffect(() => {
    fetchContacts();
  }, []);

  if (status === ResourceStatus.FETCHING || status === ResourceStatus.SAVING) {
    return (
      <>
        <Segment>
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
          <Table singleLine selectable attached sortable fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={column === 'firstName' ? direction : undefined}
                  onClick={() => changeSort('firstName')}
                >
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'company' ? direction : undefined}
                  onClick={() => changeSort('company')}
                >
                  Company
                  <ContactCompanyFilter table={Tables.Contacts} />
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'email' ? direction : undefined}
                  onClick={() => changeSort('email')}
                >
                  E-mail
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {contacts.map((x) => <ContactRow contact={x} key={x.id} />)}
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
      <Table singleLine selectable attached sortable fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'firstName' ? direction : undefined}
              onClick={() => changeSort('firstName')}
            >
              Name
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'company' ? direction : undefined}
              onClick={() => changeSort('company')}
            >
              Company
              <ContactCompanyFilter table={Tables.Contacts} />
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'email' ? direction : undefined}
              onClick={() => changeSort('email')}
            >
              E-mail
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {contacts.map((x) => <ContactRow contact={x} key={x.id} />)}
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
  const contactTable = getTable<Contact>(state, Tables.Contacts);
  return {
    total: countTotal(state, Tables.Contacts),
    fetched: countFetched(state, Tables.Contacts),
    status: contactTable.status,
    skip: contactTable.skip,
    take: contactTable.take,
    contacts: contactTable.data,
    column: contactTable.sortColumn,
    direction: contactTable.sortDirection === 'ASC'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContacts: () => dispatch(fetchTable(Tables.Contacts)),
  changeSort: (column: string) => {
    dispatch(changeSortTable(Tables.Contacts, column));
    dispatch(fetchTable(Tables.Contacts));
  },
  setTake: (take: number) => {
    dispatch(setTakeTable(Tables.Contacts, take));
    dispatch(fetchTable(Tables.Contacts));
  },
  prevPage: () => {
    dispatch(prevPageTable(Tables.Contacts));
    dispatch(fetchTable(Tables.Contacts));
  },
  nextPage: () => {
    dispatch(nextPageTable(Tables.Contacts));
    dispatch(fetchTable(Tables.Contacts));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsTable);
