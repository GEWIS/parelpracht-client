import React from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Invoice, InvoiceStatus } from '../../clients/server.generated';
import { dateToFullFinancialYear, formatLastUpdate } from '../../helpers/timestamp';
import { RootState } from '../../stores/store';
import { formatStatus } from '../../helpers/activity';
import InvoiceLink from './InvoiceLink';
import { getInvoiceStatus } from '../../stores/invoice/selectors';
import CompanyLink from '../company/CompanyLink';

interface Props {
  invoice?: Invoice,

  status: InvoiceStatus,
}

function InvoiceCompactRow(props: Props): JSX.Element {
  const { invoice, status } = props;
  if (invoice === undefined) return <Table.Row />;
  return (
    <Table.Row>
      <Table.Cell>
        <InvoiceLink id={invoice.id} />
      </Table.Cell>
      <Table.Cell>
        <CompanyLink id={invoice.companyId} />
      </Table.Cell>
      <Table.Cell>
        {dateToFullFinancialYear(invoice.startDate)}
      </Table.Cell>
      <Table.Cell>
        {formatLastUpdate(invoice.updatedAt)}
      </Table.Cell>
      <Table.Cell>
        {formatStatus(status)}
      </Table.Cell>
    </Table.Row>
  );
}

InvoiceCompactRow.defaultProps = {
  invoice: undefined,
};

const mapStateToProps = (state: RootState, props: { invoice: Invoice }) => {
  if (props.invoice === undefined) {
    return {
      status: InvoiceStatus.CREATED,
    };
  }
  return {
    status: getInvoiceStatus(state, props.invoice.id),
  };
};

export default connect(mapStateToProps)(InvoiceCompactRow);
