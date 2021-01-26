import { connect } from 'react-redux';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Invoice, InvoiceStatus } from '../../clients/server.generated';
import { getCompanyName } from '../../stores/company/selectors';
import { RootState } from '../../stores/store';
import { dateToFullFinancialYear, formatLastUpdate } from '../../helpers/timestamp';
import { formatStatus } from '../../helpers/activity';
import { getUserName } from '../../stores/user/selectors';
import { getInvoiceStatus } from '../../stores/invoice/selectors';

interface Props {
  invoice: Invoice;

  companyName: string;
  assignedName: string;
  invoiceStatus: InvoiceStatus;
}

function InvoiceRow(props: Props) {
  const {
    invoice, companyName, assignedName, invoiceStatus,
  } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/invoice/${invoice.id}`}>
          {`F${invoice.id} ${invoice.title}`}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <NavLink to={`/company/${invoice.companyId}`}>
          {companyName}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        {formatStatus(invoiceStatus)}
      </Table.Cell>
      <Table.Cell>
        {dateToFullFinancialYear(invoice.startDate)}
      </Table.Cell>
      <Table.Cell>
        {assignedName}
      </Table.Cell>
      <Table.Cell>
        {formatLastUpdate(invoice.updatedAt)}
      </Table.Cell>
    </Table.Row>
  );
}

const mapStateToProps = (state: RootState, props: { invoice: Invoice }) => {
  return {
    companyName: getCompanyName(state, props.invoice.companyId),
    assignedName: getUserName(state, props.invoice.assignedToId),
    invoiceStatus: getInvoiceStatus(state, props.invoice.id),
  };
};

export default connect(mapStateToProps)(InvoiceRow);
