import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Table } from 'semantic-ui-react';
import { DirectMail } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import {
  changeSortTable, fetchTable,
} from '../../stores/tables/actionCreators';
import { countFetched, countTotal, getTable } from '../../stores/tables/selectors';
import { Tables } from '../../stores/tables/tables';
import DirectMailRow from './DirectMailRow';

interface Props {
  directmail: DirectMail[];
  price: number;
  column: string;
  direction: 'ascending' | 'descending';
  fetchDirectMail: () => void;
  changeSort: (column: string) => void;
}

function DirectMailTable({
  directmail,
  price,
  column, direction, changeSort, fetchDirectMail,
} : Props) {
  useEffect(() => {
    fetchDirectMail();
  }, []);

  return (
    <>
      <Table singleLine selectable attached sortable fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'generation' ? direction : undefined}
              onClick={() => changeSort('generation')}
            >
              Generation
            </Table.HeaderCell>
            <Table.HeaderCell>
              Number of students
            </Table.HeaderCell>
            <Table.HeaderCell>
              Costs
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {directmail.map((x) => <DirectMailRow directmail={x} price={price} />)}
        </Table.Body>
      </Table>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const directMailTable = getTable<DirectMail>(state, Tables.DirectMail);
  return {
    total: countTotal(state, Tables.DirectMail),
    fetched: countFetched(state, Tables.DirectMail),
    column: directMailTable.sortColumn,
    directmail: directMailTable.data,
    direction: directMailTable.sortDirection === 'ASC'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchDirectMail: () => dispatch(fetchTable(Tables.DirectMail)),
  changeSort: (column: string) => {
    dispatch(changeSortTable(Tables.DirectMail, column));
    dispatch(fetchTable(Tables.DirectMail));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DirectMailTable);
