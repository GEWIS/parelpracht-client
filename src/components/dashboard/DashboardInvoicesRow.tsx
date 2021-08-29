import React from 'react';
import { Table } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { ExpiredInvoice } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';
import { RootState } from '../../stores/store';
import { formatTimestampToDate, formatTimestampToDateShort } from '../../helpers/timestamp';
import { getCompanyName } from '../../stores/company/selectors';
import { getUserFirstName } from '../../stores/user/selectors';

interface Props {
  invoice: ExpiredInvoice;
  company: string;
  currentUserId: number;
  assignedTo: string;
}

function DashboardInvoicesRow(props: Props) {
  const {
    invoice, company, currentUserId, assignedTo,
  } = props;

  return (
    <Table.Row
      error={invoice.assignedToId === currentUserId}
    >
      <Table.Cell>
        <NavLink to={`/invoice/${invoice.id}`} title={`F${invoice.id} (${company})`}>
          F
          {invoice.id}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <NavLink to={`/company/${invoice.companyId}`} title={company}>
          {company}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <span title={formatTimestampToDate(invoice.startDate)}>
          {formatTimestampToDateShort(invoice.startDate)}
        </span>
      </Table.Cell>
      <Table.Cell>
        {formatPriceFull(invoice.value)}
      </Table.Cell>
      <Table.Cell>
        <span title={assignedTo}>{assignedTo}</span>
      </Table.Cell>
    </Table.Row>
  );
}

const mapStateToProps = (state: RootState, props: { invoice: ExpiredInvoice }) => ({
  company: getCompanyName(state, props.invoice.companyId),
  currentUserId: state.auth.profile!.id,
  assignedTo: getUserFirstName(state, props.invoice.assignedToId),
});

export default connect(mapStateToProps)(DashboardInvoicesRow);
