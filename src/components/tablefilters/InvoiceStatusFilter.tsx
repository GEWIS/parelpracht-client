import ColumnFilter from '../ColumnFilter';
import { InvoiceStatus } from '../../clients/server.generated';
import { formatStatus } from '../../helpers/activity';
import { Tables } from '../../stores/tables/tables';

function InvoiceStatusFilter() {
  const options = Object.values(InvoiceStatus).map((s: string, i) => {
    return { key: i, value: s, text: formatStatus(s) };
  });

  return (
    <ColumnFilter
      column="activities.subType"
      columnName="Status"
      table={Tables.Invoices}
      options={options}
    />
  );
}

export default InvoiceStatusFilter;
