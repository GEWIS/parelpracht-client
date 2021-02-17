import React from 'react';
import { Loader, Table } from 'semantic-ui-react';
import {
  Client, PaginationParams, Product, ProductInstance,
} from '../../clients/server.generated';
import TablePagination from '../TablePagination';
import InvoiceCompactRow from './InvoiceCompactRow';

interface Props {
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

    const productInstances = await client.getProductInvoices(product.id, {
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
      this.setState({ skip: skip + take });
      await this.getProductAttributes();
    }
  };

  prevPage = async () => {
    const { skip, take } = this.state;
    if (skip - take >= 0) {
      this.setState({ skip: skip - take });
      await this.getProductAttributes();
    }
  };

  setTake = async (take: number) => {
    await this.setState({
      take,
      skip: 0,
    });
    await this.getProductAttributes();
  };

  render() {
    const {
      productInstances, countTotal, skip, take, loading,
    } = this.state;

    return (
      <>
        <h3>Invoices</h3>
        <Table striped>
          <Loader active={loading} />
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Title
              </Table.HeaderCell>
              <Table.HeaderCell>
                Company
              </Table.HeaderCell>
              <Table.HeaderCell>
                Status
              </Table.HeaderCell>
              <Table.HeaderCell>
                Year
              </Table.HeaderCell>
              <Table.HeaderCell>
                Last Update
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {productInstances.map((p) => <InvoiceCompactRow invoice={p.invoice} />)}
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
}

export default ContractCompactTable;
