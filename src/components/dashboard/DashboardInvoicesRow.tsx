import React from 'react';
import { Table } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { ExpiredInvoice } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';
import { RootState } from '../../stores/store';
import { formatTimestampToDate } from '../../helpers/timestamp';
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
      <Table.Cell>
        {assignedTo}
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
