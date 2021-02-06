import React from 'react';
import ColumnFilter from '../ColumnFilter';
import { ContractStatus } from '../../clients/server.generated';
import { formatStatus } from '../../helpers/activity';
import { Tables } from '../../stores/tables/tables';

function ContractStatusFilter() {
  const options = Object.values(ContractStatus).map((s: string, i) => {
    return { key: i, value: s, text: formatStatus(s) };
  });
  return (
    <ColumnFilter
      column="activityStatus"
      columnName="Status"
      table={Tables.Contracts}
      options={options}
    />
  );
}

export default ContractStatusFilter;
