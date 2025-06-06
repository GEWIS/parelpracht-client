import { Tables } from '../../stores/tables/tables';
import ColumnFilter from '../ColumnFilter';

function ProductStatusFilter() {
  return (
    <ColumnFilter
      column="status"
      columnName="Status"
      table={Tables.Products}
      options={[
        { key: 0, value: 'ACTIVE', text: 'Active' },
        { key: 1, value: 'INACTIVE', text: 'Inactive' }]}
    />
  );
}

export default ProductStatusFilter;
