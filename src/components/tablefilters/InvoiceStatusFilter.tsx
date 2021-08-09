import React from 'react';
import { useTranslation } from 'react-i18next';
import ColumnFilter from '../ColumnFilter';
import { InvoiceStatus } from '../../clients/server.generated';
import { formatStatus } from '../../helpers/activity';
import { Tables } from '../../stores/tables/tables';

function InvoiceStatusFilter() {
  const { t } = useTranslation();
  const options = Object.values(InvoiceStatus).map((s: string, i) => {
    return { key: i, value: s, text: formatStatus(s, t) };
  });
  return (
    <ColumnFilter
      column="activityStatus"
      columnName="Status"
      table={Tables.Invoices}
      options={options}
    />
  );
}

export default InvoiceStatusFilter;
