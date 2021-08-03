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
      <Table.Cell>
        {formatStatus(invoiceStatus)}
      </Table.Cell>
      <Table.Cell>
        {formatPriceFull(value)}
      </Table.Cell>
      <Table.Cell>
        {dateToFullFinancialYear(invoice.startDate)}
      </Table.Cell>
      <Table.Cell>
        {formatLastUpdate(invoice.updatedAt)}
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
