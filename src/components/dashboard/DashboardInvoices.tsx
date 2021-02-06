import React, { Component } from 'react';
import { Segment, Table } from 'semantic-ui-react';
import { Client, ExpiredInvoice } from '../../clients/server.generated';
import DashboardInvoicesRow from './DashboardInvoicesRow';

interface Props {
}

interface State {
  invoices: ExpiredInvoice[];
  loading: boolean;
}

class DashboardInvoices extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      invoices: [],
      loading: false,
    };
  }

  async componentDidMount() {
    const client = new Client();
    this.setState({ loading: true });
    const invoices = await client.getExpiredInvoices();
    this.setState({
      invoices,
      loading: false,
    });
  }

  render() {
    const { invoices } = this.state;

    return (
      <Segment loading={this.state.loading}>
        <h3>Expired invoices</h3>
        <Table striped compact>
          <Table.Body>
            {invoices.map((i) => <DashboardInvoicesRow invoice={i} key={i.id} />)}
          </Table.Body>
        </Table>
      </Segment>
    );
  }
}

export default DashboardInvoices;
