import { Component } from 'react';
import { Dimmer, Loader, Segment, Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { RootState } from '../../stores/store';
import { countFetched, countTotal, getTable } from '../../stores/tables/selectors';
import { Tables } from '../../stores/tables/tables';
import {
  changeSortTable,
  fetchTable,
  nextPageTable,
  prevPageTable,
  setFilterTable,
  setSortTable,
  setTakeTable,
} from '../../stores/tables/actionCreators';
import TablePagination from '../TablePagination';
import CompanyFilter from '../tablefilters/CompanyFilter';
import ProductFilter from '../tablefilters/ProductFilter';
import ProductInstanceStatusFilter from '../tablefilters/ProductInstanceStatusFilter';
import ProductInstanceInvoicedFilter from '../tablefilters/ProductInstanceInvoicedFilter';
import ResourceStatus from '../../stores/resourceStatus';
import { ContractStatus, ETCompany, ProductInstanceStatus } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';
import ContractStatusFilter from '../tablefilters/ContractStatusFilter';
import { dateToFinancialYear } from '../../helpers/timestamp';
import { withRouter, WithRouter } from '../../WithRouter';
import MegaTableRow from './MegaTableRow';

interface Props extends WithTranslation, WithRouter {
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

  fetchCompanies: () => void;
  setTableFilter: (filter: { column: string; values: any[] }) => void;
  changeSort: (column: string) => void;
  setSort: (column: string, direction: 'ASC' | 'DESC') => void;
  setTake: (take: number) => void;
  prevPage: () => void;
  nextPage: () => void;
}

interface State {
  preFilters: string;
  year?: number;
}

class MegaTable extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { location } = this.props.router;
    let { hash } = location;
    // If there is no hash, do not take the first (#) character
    if (hash.length > 0) {
      hash = hash.substr(1);
    }

    const [preFilters, year] = hash.split('&');

    this.state = {
      preFilters,
      year: year !== '' ? parseInt(year, 10) : undefined,
    };
  }

  componentDidMount() {
    const { setSort, setTableFilter, fetchCompanies } = this.props;
    setSort('companyName', 'ASC');
    setTableFilter({ column: 'status', values: [] });
    setTableFilter({ column: 'status2', values: [] });
    setTableFilter({ column: 'invoiced', values: [] });

    if (!this.state.year) {
      this.setState({ year: dateToFinancialYear(new Date()) });
    } else if (Number.isNaN(this.state.year)) {
      this.setState({ year: undefined });
    }

    switch (this.state.preFilters) {
      case 'suggested':
        setTableFilter({
          column: 'status2',
          values: [ContractStatus.CREATED, ContractStatus.PROPOSED, ContractStatus.SENT],
        });
        break;
      case 'contracted':
        setTableFilter({ column: 'status2', values: [ContractStatus.CONFIRMED, ContractStatus.FINISHED] });
        setTableFilter({
          column: 'status',
          values: [ProductInstanceStatus.NOTDELIVERED, ProductInstanceStatus.DELIVERED],
        });
        setTableFilter({ column: 'invoiced', values: [-1, this.state.year] });
        break;
      case 'delivered':
        setTableFilter({ column: 'status2', values: [ContractStatus.CONFIRMED, ContractStatus.FINISHED] });
        setTableFilter({ column: 'status', values: [ProductInstanceStatus.DELIVERED] });
        setTableFilter({ column: 'invoiced', values: [-1, this.state.year] });
        break;
      case 'invoiced':
        setTableFilter({ column: 'status2', values: [ContractStatus.CONFIRMED, ContractStatus.FINISHED] });
        setTableFilter({ column: 'invoiced', values: [this.state.year] });
        break;
      default:
        setTableFilter({ column: 'invoiced', values: [-1] });
        setTableFilter({
          column: 'status',
          values: [ProductInstanceStatus.NOTDELIVERED, ProductInstanceStatus.DELIVERED],
        });
        break;
    }

    fetchCompanies();
  }

  render() {
    const {
      companies,
      column,
      direction,
      changeSort,
      total,
      fetched,
      skip,
      take,
      status,
      prevPage,
      nextPage,
      setTake,
      sumProducts,
      nrOfProducts,
      t,
    } = this.props;
    return (
      <>
        <Segment style={{ padding: '0px' }}>
          {status === ResourceStatus.FETCHING || status === ResourceStatus.SAVING ? (
            <Dimmer active inverted>
              <Loader inverted />
            </Dimmer>
          ) : null}
          <Table attached compact sortable striped fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={column === 'companyName' ? direction : undefined}
                  onClick={() => changeSort('companyName')}
                  width={3}
                >
                  {t('entity.company')}
                  <CompanyFilter table={Tables.ETCompanies} />
                </Table.HeaderCell>
                <Table.HeaderCell width={3}>
                  {t('entity.contract')}
                  <ContractStatusFilter column="status2" columnName="Contract Status" table={Tables.ETCompanies} />
                </Table.HeaderCell>
                <Table.HeaderCell width={2}>
                  {t('entity.product')}
                  <ProductFilter />
                </Table.HeaderCell>
                <Table.HeaderCell width={2}>
                  {t('entities.generalProps.status')}
                  <ProductInstanceStatusFilter columnName="Product Status" />
                </Table.HeaderCell>
                <Table.HeaderCell width={2}>
                  {t('entities.productInstance.props.invoiced')}
                  <ProductInstanceInvoicedFilter />
                </Table.HeaderCell>
                <Table.HeaderCell>{t('entities.productInstance.props.price')}</Table.HeaderCell>
                <Table.HeaderCell>{t('entities.productInstance.props.details')}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {companies.map((c) => (
                <MegaTableRow company={c} key={c.id} />
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="3">{t('pages.insights.totals')}</Table.HeaderCell>
                <Table.HeaderCell colSpan="2" style={{ textAlign: 'center' }}>
                  {t('pages.insights.nrOfProducts')}
                  {': '}
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
    nrOfProducts: contractTable.extra.nrOfProducts,
    sumProducts: contractTable.extra.sumProducts,
    column: contractTable.sortColumn,
    direction: contractTable.sortDirection === 'ASC' ? 'ascending' : ('descending' as 'ascending' | 'descending'),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCompanies: () => dispatch(fetchTable(Tables.ETCompanies)),
  setTableFilter: (filter: { column: string; values: any[] }) => {
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

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(MegaTable)));
