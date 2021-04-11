import React, { useEffect } from 'react';
import {
  Dimmer, Loader, Segment, Table,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import MegaTableRow from './MegaTableRow';
import { RootState } from '../../stores/store';
import { countFetched, countTotal, getTable } from '../../stores/tables/selectors';
import { Tables } from '../../stores/tables/tables';
import {
  changeSortTable,
  fetchTable,
  nextPageTable,
  prevPageTable, setFilterTable, setSortTable,
  setTakeTable,
} from '../../stores/tables/actionCreators';
import TablePagination from '../TablePagination';
import CompanyFilter from '../tablefilters/CompanyFilter';
import ProductFilter from '../tablefilters/ProductFilter';
import ProductInstanceStatusFilter from '../tablefilters/ProductInstanceStatusFilter';
import ProductInstanceInvoicedFilter from '../tablefilters/ProductInstanceInvoicedFilter';
import ResourceStatus from '../../stores/resourceStatus';
import { ETCompany } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';

interface Props {
  companies: ETCompany[];
  nrOfProducts: number;
  sumProducts: number;
  column: string;
  direction: 'ascending' | 'descending';
  total: number;
  fetched: number;
  skip: number;
  take: number;
  status: ResourceStatus;

  fetchContracts: () => void;
  setTableFilter: (filter: { column: string, values: any[] }) => void;
  changeSort: (column: string) => void;
  setSort: (column: string, direction: 'ASC' | 'DESC') => void;
  setTake: (take: number) => void;
  prevPage: () => void;
  nextPage: () => void;
}

function MegaTable({
  companies, fetchContracts, setTableFilter, column, direction, changeSort, setSort,
  total, fetched, skip, take, status,
  prevPage, nextPage, setTake,
  sumProducts, nrOfProducts,
}: Props) {
  useEffect(() => {
    setSort('companyName', 'ASC');
    setTableFilter({ column: 'invoiced', values: [-1] });
    fetchContracts();
  }, []);

  return (
    <>
      <Segment style={{ padding: '0px' }}>
        {status === ResourceStatus.FETCHING || status === ResourceStatus.SAVING
          ? (
            <Dimmer active inverted>
              <Loader inverted />
            </Dimmer>
          ) : null}
        <Table className="rowspanStriped" attached compact sortable color="brown">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'companyName' ? direction : undefined}
                onClick={() => changeSort('companyName')}
                style={{ color: 'peach' }}
              >
                Company
                <CompanyFilter table={Tables.ETCompanies} />
              </Table.HeaderCell>
              <Table.HeaderCell>Contract</Table.HeaderCell>
              <Table.HeaderCell>
                Product
                <ProductFilter />
              </Table.HeaderCell>
              <Table.HeaderCell>
                Status
                <ProductInstanceStatusFilter />
              </Table.HeaderCell>
              <Table.HeaderCell>
                Invoiced
                <ProductInstanceInvoicedFilter />
              </Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Details</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {companies.map((c) => <MegaTableRow company={c} key={c.id} />)}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="3">
                Totals
              </Table.HeaderCell>
              <Table.HeaderCell colSpan="2" style={{ textAlign: 'center' }}>
                Number of products:
                {' '}
                {nrOfProducts || 0}
              </Table.HeaderCell>
              <Table.HeaderCell collapsing>{formatPriceFull(sumProducts || 0)}</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Footer>
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

const mapStateToProps = (state: RootState) => {
  const contractTable = getTable<ETCompany>(state, Tables.ETCompanies);
  return {
    total: countTotal(state, Tables.ETCompanies),
    fetched: countFetched(state, Tables.ETCompanies),
    status: contractTable.status,
    skip: contractTable.skip,
    take: contractTable.take,
    companies: contractTable.data,
    // @ts-ignore
    nrOfProducts: contractTable.extra.nrOfProducts,
    // @ts-ignore
    sumProducts: contractTable.extra.sumProducts,
    column: contractTable.sortColumn,
    direction: contractTable.sortDirection === 'ASC'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContracts: () => dispatch(fetchTable(Tables.ETCompanies)),
  setTableFilter: (filter: { column: string, values: any[] }) => {
    dispatch(setFilterTable(Tables.ETCompanies, filter));
  },
  changeSort: (column: string) => {
    dispatch(changeSortTable(Tables.ETCompanies, column));
    dispatch(fetchTable(Tables.ETCompanies));
  },
  setSort: (column: string, direction: 'ASC' | 'DESC') => {
    dispatch(setSortTable(Tables.ETCompanies, column, direction));
    dispatch(fetchTable(Tables.ETCompanies));
  },
  setTake: (take: number) => {
    dispatch(setTakeTable(Tables.ETCompanies, take));
    dispatch(fetchTable(Tables.ETCompanies));
  },
  prevPage: () => {
    dispatch(prevPageTable(Tables.ETCompanies));
    dispatch(fetchTable(Tables.ETCompanies));
  },
  nextPage: () => {
    dispatch(nextPageTable(Tables.ETCompanies));
    dispatch(fetchTable(Tables.ETCompanies));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MegaTable);
