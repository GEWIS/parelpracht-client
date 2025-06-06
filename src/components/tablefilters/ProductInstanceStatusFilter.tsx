import ColumnFilter from '../ColumnFilter';
import { Tables } from '../../stores/tables/tables';
import { ProductInstanceStatus } from '../../clients/server.generated';

interface Props {
  columnName?: string;
}

function ProductInstanceStatusFilter({
  columnName = 'Status',
}: Props) {
  return (
    <ColumnFilter
      column="status"
      columnName={columnName}
      table={Tables.ETCompanies}
      options={[
        { key: 0, value: ProductInstanceStatus.NOTDELIVERED, text: 'Not delivered' },
        { key: 1, value: ProductInstanceStatus.DELIVERED, text: 'Delivered' },
        { key: 2, value: ProductInstanceStatus.CANCELLED, text: 'Cancelled' },
        { key: 3, value: ProductInstanceStatus.DEFERRED, text: 'Deferred' },
      ]}
    />
  );
}

export default ProductInstanceStatusFilter;
