import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Dimmer, Loader, Segment, Table,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Contract } from '../../../clients/server.generated';
import TablePagination from '../../TablePagination';
import { RootState } from '../../../stores/store';
import {
  changeSortTable, fetchTable, nextPageTable, prevPageTable, setSortTable, setTakeTable,
} from '../../../stores/tables/actionCreators';
import { countFetched, countTotal, getTable } from '../../../stores/tables/selectors';
import { Tables } from '../../../stores/tables/tables';
import ContractContactFilter from '../../tablefilters/ContractContactFilter';
import CompanyFilter from '../../tablefilters/CompanyFilter';
import ContractStatusFilter from '../../tablefilters/ContractStatusFilter';
import ResourceStatus from '../../../stores/resourceStatus';
import ContractRow from './ContractRow';

interface Props {
  contracts: Contract[];
  column: string;
  direction: 'ascending' | 'descending';
  total: number;
  fetched: number;
  skip: number;
  take: number;
  status: ResourceStatus,

  fetchContracts: () => void;
  changeSort: (column: string) => void;
  setSort: (column: string, direction: 'ASC' | 'DESC') => void;
  setTake: (take: number) => void;
  prevPage: () => void;
  nextPage: () => void;
}

function ContractsTable({
  contracts, fetchContracts, column, direction, changeSort, setSort,
  total, fetched, skip, take, status,
  prevPage, nextPage, setTake,
}: Props) {
  useEffect(() => {
    setSort('id', 'DESC');
    fetchContracts();
  }, [setSort, fetchContracts]);
  const { t } = useTranslation();

  const table = (
    <>
      <Table singleLine selectable attached sortable fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'id' ? direction : undefined}
              onClick={() => changeSort('id')}
              width={1}
            >
              {t('entities.generalProps.ID')}
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'title' ? direction : undefined}
              onClick={() => changeSort('title')}
              width={3}
            >
              {t('entities.contract.props.title')}
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'company' ? direction : undefined}
              onClick={() => changeSort('company')}
              width={3}
            >
              {t('entity.company')}
              <CompanyFilter table={Tables.Contracts} />
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'contact' ? direction : undefined}
              onClick={() => changeSort('contact')}
              width={2}
            >
              {t('entity.contactShort')}
              <ContractContactFilter />
            </Table.HeaderCell>
            <Table.HeaderCell width={2} collapsing>
              {t('entities.generalProps.status')}
              <ContractStatusFilter />
            </Table.HeaderCell>
            <Table.HeaderCell width={2}>
              {t('entities.generalProps.amount')}
            </Table.HeaderCell>
            <Table.HeaderCell
              collapsing
              sorted={column === 'updatedAt' ? direction : undefined}
              onClick={() => changeSort('updatedAt')}
              width={3}
            >
              {t('entities.generalProps.lastUpdate')}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {contracts.map((x) => <ContractRow contract={x} key={x.id} />)}
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

  if (status === ResourceStatus.FETCHING || status === ResourceStatus.SAVING) {
    return (
      <>
        <Segment style={{ padding: '0px' }}>
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
          {table}
        </Segment>
      </>
    );
  }

  return table;
}

const mapStateToProps = (state: RootState) => {
  const contractTable = getTable<Contract>(state, Tables.Contracts);
  return {
    total: countTotal(state, Tables.Contracts),
    fetched: countFetched(state, Tables.Contracts),
    status: contractTable.status,
    skip: contractTable.skip,
    take: contractTable.take,
    contracts: contractTable.data,
    column: contractTable.sortColumn,
    direction: contractTable.sortDirection === 'ASC'
      ? 'ascending' : 'descending' as 'ascending' | 'descending',
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContracts: () => dispatch(fetchTable(Tables.Contracts)),
  changeSort: (column: string) => {
    dispatch(changeSortTable(Tables.Contracts, column));
    dispatch(fetchTable(Tables.Contracts));
  },
  setSort: (column: string, direction: 'ASC' | 'DESC') => {
    dispatch(setSortTable(Tables.Contracts, column, direction));
    dispatch(fetchTable(Tables.Contracts));
  },
  setTake: (take: number) => {
    dispatch(setTakeTable(Tables.Contracts, take));
    dispatch(fetchTable(Tables.Contracts));
  },
  prevPage: () => {
    dispatch(prevPageTable(Tables.Contracts));
    dispatch(fetchTable(Tables.Contracts));
  },
  nextPage: () => {
    dispatch(nextPageTable(Tables.Contracts));
    dispatch(fetchTable(Tables.Contracts));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContractsTable);
