import React from 'react';
import { Table } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { ExpiredInvoice } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';
import { RootState } from '../../stores/store';
import { formatTimestampToDate } from '../../helpers/timestamp';
import { getCompanyName } from '../../stores/company/selectors';

interface Props {
  invoice: ExpiredInvoice,
  company: string;
}

function DashboardInvoicesRow(props: Props) {
  const { invoice, company } = props;

  // const totalPrice = (): number => {
  //   return invoice.products
  //     .map((p) => p.basePrice - p.discount)
  //     .reduce((a, b) => a + b, 0);
  // };

  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/invoice/${invoice.id}`}>
          F
          {invoice.id}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <NavLink to={`/company/${invoice.companyId}`}>
          {company}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        {formatTimestampToDate(invoice.startDate)}
      </Table.Cell>
      <Table.Cell>
        {formatPriceFull(invoice.value)}
      </Table.Cell>
    </Table.Row>
  );
}

const mapStateToProps = (state: RootState, props: { invoice: ExpiredInvoice }) => ({
  company: getCompanyName(state, props.invoice.companyId),
});

export default connect(mapStateToProps)(DashboardInvoicesRow);
