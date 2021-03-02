import { Invoice, InvoiceStatus, InvoiceSummary } from '../../clients/server.generated';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';

export function sortColumn(state: RootState): string {
  const column = getTable<Invoice>(state, Tables.Invoices).sortColumn;
  switch (column) {
    case 'id': return 'ID';
    case 'title': return 'Title';
    case 'company': return 'Company';
    case 'startDate': return 'Financial Year';
    case 'assignedTo': return 'Assigned To';
    case 'updatedAt': return 'Last Update';
    default: return 'unknown';
  }
}

export function getInvoiceTitle(state: RootState, id: number): string {
  return getSummary<InvoiceSummary>(
    state, SummaryCollections.Invoices, id,
  )?.title ?? '...';
}

export function getInvoiceStatus(state: RootState, id: number): InvoiceStatus {
  return getSummary<InvoiceSummary>(
    state, SummaryCollections.Invoices, id,
  )?.status ?? '...';
}

export function getTreasurerLastSeen(state: RootState): Date | undefined {
  return getTable(state, Tables.Invoices).lastSeen;
}
