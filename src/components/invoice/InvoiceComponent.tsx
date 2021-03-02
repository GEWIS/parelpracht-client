import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Table,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getCompanyName } from '../../stores/company/selectors';
import { RootState } from '../../stores/store';
/* import TablePagination from '../TablePagination'; */
import { dateToFullFinancialYear, formatLastUpdate } from '../../helpers/timestamp';
import { Invoice, InvoiceStatus } from '../../clients/server.generated';
import { formatStatus } from '../../helpers/activity';
import { getInvoiceStatus } from '../../stores/invoice/selectors';
import { formatPriceFull } from '../../helpers/monetary';

interface Props {
  invoice: Invoice;
  invoiceStatus: InvoiceStatus;
}

function InvoiceComponent(props: Props) {
  const {
    invoice, invoiceStatus,
  } = props;

  const { products } = invoice;
  let priceSum = 0;
  let discountSum = 0;

  products.forEach((p) => {
    priceSum += p.basePrice;
    discountSum += p.discount;
  });

  const discountedPriceSum = priceSum - discountSum;

  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/invoice/${invoice.id}`}>
          {`F${invoice.id} ${invoice.title}`}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        {formatPriceFull(discountedPriceSum)}
      </Table.Cell>
      <Table.Cell>
        {formatStatus(invoiceStatus)}
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
    companyName: getCompanyName(state, props.invoice.companyId),
    invoiceStatus: getInvoiceStatus(state, props.invoice.id),
  };
};

export default connect(mapStateToProps)(InvoiceComponent);
