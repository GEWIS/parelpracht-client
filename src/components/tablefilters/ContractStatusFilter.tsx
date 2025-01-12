import React from 'react';
import ColumnFilter from '../ColumnFilter';
import { ContractStatus } from '../../clients/server.generated';
import { formatStatus } from '../../helpers/activity';
import { Tables } from '../../stores/tables/tables';

interface Props {
  column?: string;
  columnName?: string;
  table?: Tables;
}

function ContractStatusFilter(props: Props) {
  const options = Object.values(ContractStatus).map((s: string, i) => {
    return { key: i, value: s, text: formatStatus(s) };
  });

  return (
    <ColumnFilter
      column={props.column!}
      columnName={props.columnName!}
      table={props.table!}
      options={options}
    />
  );
}

ContractStatusFilter.defaultProps = {
  column: 'activities.subType',
  columnName: 'Status',
  table: Tables.Contracts,
};

export default ContractStatusFilter;
