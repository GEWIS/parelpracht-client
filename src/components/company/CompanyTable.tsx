import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Dimmer, Loader, Segment, Table,
} from 'semantic-ui-react';
import { Company } from '../../clients/server.generated';
import TablePagination from '../TablePagination';
import { RootState } from '../../stores/store';
import {
  changeSortTable, fetchTable, nextPageTable, prevPageTable, setFilterTable, setSortTable,
  setTakeTable,
} from '../../stores/tables/actionCreators';
import { countFetched, countTotal, getTable } from '../../stores/tables/selectors';
import { Tables } from '../../stores/tables/tables';
import { CompanyRow } from './CompanyRow';
import CompanyStatusFilter from '../tablefilters/CompanyStatusFilter';
import ResourceStatus from '../../stores/resourceStatus';

interface Props {
  companies: Company[];
  column: string;
  direction: 'ascending' | 'descending';
  total: number;
  fetched: number;
  skip: number;
  take: number;
  status: ResourceStatus;

  fetchCompanies: () => void;
  setTableFilter: (filter: { column: string, values: any[] }) => void;
  changeSort: (column: string) => void;
  setSort: (column: string, direction: 'ASC' | 'DESC') => void;
  setTake: (take: number) => void;
  prevPage: () => void;
  nextPage: () => void;
}

function CompaniesTable({
  companies, fetchCompanies, column, direction, changeSort, setSort, setTableFilter,
  total, fetched, skip, take, status,
  prevPage, nextPage, setTake,
}: Props) {
  useEffect(() => {
    setSort('name', 'ASC');
    setTableFilter({ column: 'status', values: ['ACTIVE'] });
    fetchCompanies();
  }, []);

  if (status === ResourceStatus.FETCHING || status === ResourceStatus.SAVING) {
    return (
      <>
        <Segment style={{ padding: '0px' }}>
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
          <Table singleLine selectable attached sortable fixed color="brown">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={column === 'name' ? direction : undefined}
                  onClick={() => changeSort('name')}
                >
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'status' ? direction : undefined}
                  onClick={() => changeSort('status')}
                >
                  Status
                  <CompanyStatusFilter />
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
              {companies.map((x) => <CompanyRow company={x} key={x.id} />)}
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
      <Table singleLine selectable attached sortable fixed color="brown">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'name' ? direction : undefined}
              onClick={() => changeSort('name')}
            >
              Name
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'status' ? direction : undefined}
              onClick={() => changeSort('status')}
            >
              Status
              <CompanyStatusFilter />
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
          {companies.map((x) => <CompanyRow company={x} key={x.id} />)}
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
  const companyTable = getTable<Company>(state, Tables.Companies);
  return {
    total: countTotal(state, Tables.Companies),
    fetched: countFetched(state, Tables.Companies),
    status: companyTable.status,
    skip: companyTable.skip,
    take: companyTable.take,
    companies: companyTable.data,
    column: companyTable.sortColumn,
    direction: companyTable.sortDirection === 'ASC'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCompanies: () => dispatch(fetchTable(Tables.Companies)),
  setTableFilter: (filter: { column: string, values: any[] }) => {
    dispatch(setFilterTable(Tables.Companies, filter));
  },
  changeSort: (column: string) => {
    dispatch(changeSortTable(Tables.Companies, column));
    dispatch(fetchTable(Tables.Companies));
  },
  setSort: (column: string, direction: 'ASC' | 'DESC') => {
    dispatch(setSortTable(Tables.Companies, column, direction));
    dispatch(fetchTable(Tables.Companies));
  },
  setTake: (take: number) => {
    dispatch(setTakeTable(Tables.Companies, take));
    dispatch(fetchTable(Tables.Companies));
  },
  prevPage: () => {
    dispatch(prevPageTable(Tables.Companies));
    dispatch(fetchTable(Tables.Companies));
  },
  nextPage: () => {
    dispatch(nextPageTable(Tables.Companies));
    dispatch(fetchTable(Tables.Companies));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesTable);
