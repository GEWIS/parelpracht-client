import { connect } from 'react-redux';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Invoice } from '../../clients/server.generated';
import { getCompanyName } from '../../stores/company/selectors';
import { RootState } from '../../stores/store';
import { formatLastUpdate } from '../../helpers/lastUpdate';

interface Props {
  invoice: Invoice;

  companyName: string;
}

function InvoiceRow(props: Props) {
  const { invoice, companyName } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/invoice/${invoice.id}`}>
          {invoice.id}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <NavLink to={`/company/${invoice.companyId}`}>
          {companyName}
        </NavLink>
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
  };
};

export default connect(mapStateToProps)(InvoiceRow);
