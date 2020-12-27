import React from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Invoice } from '../../clients/server.generated';

interface Props {
  invoice: Invoice;
}

export function InvoiceRow(props: Props) {
  const { invoice } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/invoice/${invoice.id}`}>
          {invoice.companyId}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <NavLink to={`/invoice/${invoice.id}`}>
          {invoice.company}
        </NavLink>
      </Table.Cell>
      {/* <Table.Cell>
        {invoice.status === InvoiceStatus.ACTIVE ? 'Active' : 'Inactive'}
      </Table.Cell> */}
    </Table.Row>
  );
}
