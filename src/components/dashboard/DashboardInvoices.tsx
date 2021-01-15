import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { Invoice } from '../../clients/server.generated';
import DashboardInvoicesRow from './DashboardInvoicesRow';

interface Props {
  invoices: Invoice[];
}

class DashboardInvoices extends Component<Props> {
  render() {
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="3">Git Repository</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.props.invoices.map((i) => <DashboardInvoicesRow invoice={i} />)}
        </Table.Body>
      </Table>
    );
  }
}

export default DashboardInvoices;
