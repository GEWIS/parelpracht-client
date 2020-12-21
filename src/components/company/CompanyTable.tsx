import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Table } from 'semantic-ui-react';
import { Company } from '../../clients/server.generated';
import TablePagination from '../../components/TablePagination';
import {
  fetchCompanies as createFetchCompanies, changeSortCompanies,
  setTakeCompanies, prevPageCompanies, nextPageCompanies,
} from '../../stores/company/actionCreators';
import { countFetchedCompanies, countTotalCompanies } from '../../stores/company/selectors';
import { RootState } from '../../stores/store';
import { CompanyRow } from './CompanyRow';

interface Props {
  companies: Company[];
  column: string;
  direction: 'ascending' | 'descending';
  countTotal: number;
  countFetched: number;
  skip: number;
  take: number;

  fetchCompanies: () => void;
  changeSort: (column: string) => void;
  setTake: (take: number) => void;
  prevPage: () => void;
  nextPage: () => void;
}

function CompaniesTable({
  companies, fetchCompanies, column, direction, changeSort,
  countTotal, countFetched, skip, take,
  prevPage, nextPage, setTake,
}: Props) {
  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <>
      <Table singleLine selectable attached sortable fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'nameDutch' ? direction : undefined}
              onClick={() => changeSort('nameDutch')}
            >
              Name (Dutch)
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'nameEnglish' ? direction : undefined}
              onClick={() => changeSort('nameEnglish')}
            >
              Name (English)
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'targetPrice' ? direction : undefined}
              onClick={() => changeSort('targetPrice')}
            >
              Target price
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'status' ? direction : undefined}
              onClick={() => changeSort('status')}
            >
              Status
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {companies.map((x) => <CompanyRow company={x} key={x.id} />)}
        </Table.Body>
      </Table>
      <TablePagination
        countTotal={countTotal}
        countFetched={countFetched}
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
  return {
    countTotal: countTotalCompanies(state),
    countFetched: countFetchedCompanies(state),
    skip: state.company.listSkip,
    take: state.company.listTake,
    companies: state.company.list,
    column: state.company.listSortColumn,
    direction: state.company.listSortDirection === 'ASC'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCompanies: () => dispatch(createFetchCompanies()),
  changeSort: (column: string) => {
    dispatch(changeSortCompanies(column));
    dispatch(createFetchCompanies());
  },
  setTake: (take: number) => {
    dispatch(setTakeCompanies(take));
    dispatch(createFetchCompanies());
  },
  prevPage: () => {
    dispatch(prevPageCompanies());
    dispatch(createFetchCompanies());
  },
  nextPage: () => {
    dispatch(nextPageCompanies());
    dispatch(createFetchCompanies());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesTable);
