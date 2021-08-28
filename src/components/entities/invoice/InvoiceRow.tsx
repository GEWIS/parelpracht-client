import { connect } from 'react-redux';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Invoice, InvoiceStatus } from '../../../clients/server.generated';
import { RootState } from '../../../stores/store';
import { dateToFullFinancialYear, formatLastUpdate } from '../../../helpers/timestamp';
import { formatStatus } from '../../../helpers/activity';
import { getInvoiceStatus, getInvoiceValue } from '../../../stores/invoice/selectors';
import CompanyLink from '../company/CompanyLink';
import { formatPriceFull } from '../../../helpers/monetary';

interface Props {
  invoice: Invoice;
  invoiceStatus: InvoiceStatus;
  value: number;
}

function InvoiceRow(props: Props) {
  const {
    invoice, value, invoiceStatus,
  } = props;

  const status = formatStatus(invoiceStatus);
  const amount = formatPriceFull(value);
  const financialYear = dateToFullFinancialYear(invoice.startDate);
  const lastUpdate = formatLastUpdate(invoice.updatedAt);

  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/invoice/${invoice.id}`}>
          {`F${invoice.id}`}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <NavLink to={`/invoice/${invoice.id}`}>
          {invoice.title}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <CompanyLink id={invoice.companyId} />
      </Table.Cell>
      <Table.Cell title={status}>
        {status}
      </Table.Cell>
      <Table.Cell title={amount}>
        {amount}
      </Table.Cell>
      <Table.Cell title={financialYear}>
        {financialYear}
      </Table.Cell>
      <Table.Cell title={lastUpdate}>
        {lastUpdate}
      </Table.Cell>
    </Table.Row>
  );
}

const mapStateToProps = (state: RootState, props: { invoice: Invoice }) => {
  return {
    invoiceStatus: getInvoiceStatus(state, props.invoice.id),
    value: getInvoiceValue(state, props.invoice.id),
  };
};

export default connect(mapStateToProps)(InvoiceRow);
