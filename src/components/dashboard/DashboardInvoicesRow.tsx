import React from 'react';
import { Table } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { Invoice } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';

interface Props {
  invoice: Invoice;
}

function DashboardInvoicesRow(props: Props) {
  const { invoice } = props;

  const totalPrice = (): number => {
    return invoice.products
      .map((p) => p.basePrice - p.discount)
      .reduce((a, b) => a + b, 0);
  };

  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/invoice/${invoice.id}`}>
          F
          {invoice.id}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        {invoice.company.name}
      </Table.Cell>
      <Table.Cell>
        {formatPriceFull(totalPrice())}
      </Table.Cell>
      <Table.Cell>
        2020
      </Table.Cell>
    </Table.Row>
  );
}

export default DashboardInvoicesRow;
