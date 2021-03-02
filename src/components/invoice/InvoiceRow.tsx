import { connect } from 'react-redux';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Invoice, InvoiceStatus } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { dateToFullFinancialYear, formatLastUpdate } from '../../helpers/timestamp';
import { formatStatus } from '../../helpers/activity';
import { getUserName } from '../../stores/user/selectors';
import { getInvoiceStatus } from '../../stores/invoice/selectors';
import CompanyLink from '../company/CompanyLink';

interface Props {
  invoice: Invoice;

  assignedName: string;
  invoiceStatus: InvoiceStatus;
}

function InvoiceRow(props: Props) {
  const {
    invoice, assignedName, invoiceStatus,
  } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/invoice/${invoice.id}`}>
          {`F${invoice.id} ${invoice.title}`}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <CompanyLink id={invoice.companyId} />
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
    assignedName: getUserName(state, props.invoice.assignedToId),
    invoiceStatus: getInvoiceStatus(state, props.invoice.id),
  };
};

export default connect(mapStateToProps)(InvoiceRow);
