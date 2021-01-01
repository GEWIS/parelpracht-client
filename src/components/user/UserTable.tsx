import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Table } from 'semantic-ui-react';
import { User } from '../../clients/server.generated';
import TablePagination from '../TablePagination';
import { RootState } from '../../stores/store';
import {
  changeSortTable, fetchTable, nextPageTable, prevPageTable, setTakeTable,
} from '../../stores/tables/actionCreators';
import { countFetched, countTotal, getTable } from '../../stores/tables/selectors';
import { Tables } from '../../stores/tables/tables';
import UserRow from './UserRow';

interface Props {
  users: User[];
  column: string;
  direction: 'ascending' | 'descending';
  total: number;
  fetched: number;
  skip: number;
  take: number;

  fetchUsers: () => void;
  changeSort: (column: string) => void;
  setTake: (take: number) => void;
  prevPage: () => void;
  nextPage: () => void;
}

function UsersTable({
  users, fetchUsers, column, direction, changeSort,
  total, fetched, skip, take,
  prevPage, nextPage, setTake,
}: Props) {
  useEffect(() => {
    fetchUsers();
  }, []);

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
              sorted={column === 'email' ? direction : undefined}
              onClick={() => changeSort('email')}
            >
              E-mail
            </Table.HeaderCell>
            <Table.HeaderCell width={2}>
              Signee
            </Table.HeaderCell>
            <Table.HeaderCell width={2}>
              Financial
            </Table.HeaderCell>
            <Table.HeaderCell width={2}>
              General
            </Table.HeaderCell>
            <Table.HeaderCell width={2}>
              Audit
            </Table.HeaderCell>
            <Table.HeaderCell width={2}>
              Admin
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((x) => <UserRow user={x} key={x.id} />)}
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
  const userTable = getTable<User>(state, Tables.Users);
  return {
    total: countTotal(state, Tables.Users),
    fetched: countFetched(state, Tables.Users),
    skip: userTable.skip,
    take: userTable.take,
    users: userTable.data,
    column: userTable.sortColumn,
    direction: userTable.sortDirection === 'ASC'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchUsers: () => dispatch(fetchTable(Tables.Users)),
  changeSort: (column: string) => {
    dispatch(changeSortTable(Tables.Users, column));
    dispatch(fetchTable(Tables.Users));
  },
  setTake: (take: number) => {
    dispatch(setTakeTable(Tables.Users, take));
    dispatch(fetchTable(Tables.Users));
  },
  prevPage: () => {
    dispatch(prevPageTable(Tables.Users));
    dispatch(fetchTable(Tables.Users));
  },
  nextPage: () => {
    dispatch(nextPageTable(Tables.Users));
    dispatch(fetchTable(Tables.Users));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersTable);
