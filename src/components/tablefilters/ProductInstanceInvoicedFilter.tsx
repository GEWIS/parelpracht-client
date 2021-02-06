import React from 'react';
import ColumnFilter from '../ColumnFilter';
import { Tables } from '../../stores/tables/tables';

function ProductInstanceInvoicedFilter() {
  return (
    <ColumnFilter
      column="invoiced"
      columnName="Invoiced"
      multiple={false}
      table={Tables.ETCompanies}
      options={[
        { key: 0, value: false, text: 'Not invoiced' },
        { key: 1, value: true, text: 'Invoiced' },
      ]}
    />
  );
}

export default ProductInstanceInvoicedFilter;
