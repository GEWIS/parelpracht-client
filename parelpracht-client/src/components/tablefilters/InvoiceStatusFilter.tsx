import ColumnFilter from '../ColumnFilter';
import { InvoiceStatus } from '../../clients/server.generated';
import { formatTranslateStatus } from '../../helpers/activity';
import { Tables } from '../../stores/tables/tables';

function InvoiceStatusFilter() {
  const options = Object.values(InvoiceStatus).map((s: string, i) => {
    return { key: i, value: s, text: formatTranslateStatus(s) };
  });

  return <ColumnFilter column="activities.subType" columnName="Status" table={Tables.Invoices} options={options} />;
}

export default InvoiceStatusFilter;
