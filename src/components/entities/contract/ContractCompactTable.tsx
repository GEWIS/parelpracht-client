import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Loader, Table } from 'semantic-ui-react';
import {
  Client, PaginationParams, Product, ProductInstance,
} from '../../../clients/server.generated';
import TablePagination from '../../TablePagination';
import ContractCompactRow from './ContractCompactRow';

interface Props extends WithTranslation {
  product: Product;
}

interface State {
  productInstances: ProductInstance[];
  countTotal: number;
  loading: boolean;

  skip: number;
  take: number;
}

class ContractCompactTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      productInstances: [],
      countTotal: 0,
      skip: 0,
      take: 20,
      loading: false,
    };
  }

  async componentDidMount() {
    await this.getProductAttributes();
  }

  async getProductAttributes() {
    const { skip, take } = this.state;
    const { product } = this.props;
    this.setState({ loading: true });
    const client = new Client();

    const productInstances = await client.getProductContracts(product.id, {
      skip,
      take,
    } as PaginationParams);

    this.setState({
      productInstances: productInstances.list,
      countTotal: productInstances.count,
      loading: false,
    });
    this.render();
  }

  nextPage = async () => {
    const { skip, take, countTotal } = this.state;
    if (skip + take <= countTotal) {
      this.setState({ skip: skip + take }, () => this.getProductAttributes());
    }
  };

  prevPage = async () => {
    const { skip, take } = this.state;
    if (skip - take >= 0) {
      this.setState({ skip: skip - take }, () => this.getProductAttributes());
    }
  };

  setTake = async (take: number) => {
    this.setState({
      take,
      skip: 0,
    }, () => this.getProductAttributes());
  };

  render() {
    const {
      productInstances, countTotal, skip, take, loading,
    } = this.state;
    const { t } = this.props;

    let contractList;
    if (productInstances.length === 0) {
      contractList = (
        <h4>
          {t('entities.product.noContract')}
        </h4>
      );
    } else {
      contractList = (
        <>
          <Table striped compact>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  {t('entities.contract.props.title')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t('entity.company')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t('entities.generalProps.status')}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {t('entities.generalProps.lastUpdate')}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {productInstances
                .sort((a, b) => { return b.updatedAt.getTime() - a.updatedAt.getTime(); })
                .map((p) => <ContractCompactRow key={p.id} contract={p.contract} />)}
            </Table.Body>
          </Table>
          <TablePagination
            countTotal={countTotal}
            countFetched={productInstances.length}
            skip={skip}
            take={take}
            nextPage={this.nextPage}
            prevPage={this.prevPage}
            setTake={this.setTake}
          />
        </>
      );
    }

    return (
      <>
        <h3>{t('entity.contracts')}</h3>
        <Loader active={loading} />
        {contractList}
      </>
    );
  }
}

export default withTranslation()(ContractCompactTable);
