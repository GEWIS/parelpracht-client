import React from 'react';
import { Tables } from '../../stores/tables/tables';
import ColumnFilter from '../ColumnFilter';

function CompanyStatusFilter() {
  return (
    <ColumnFilter
      column="status"
      columnName="Status"
      table={Tables.Companies}
      options={[
        { key: 0, value: 'ACTIVE', text: 'Active' },
        { key: 1, value: 'INACTIVE', text: 'Inactive' },
      ]}
    />
  );
}

export default CompanyStatusFilter;
