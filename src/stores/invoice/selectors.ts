import { Invoice, InvoiceSummary } from '../../clients/server.generated';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';

export function sortColumn(state: RootState): string {
  const column = getTable<Invoice>(state, Tables.Invoices).sortColumn;
  switch (column) {
    case 'id': return 'ID';
    case 'nameDutch': return 'Name (Dutch)';
    case 'nameEnglish': return 'Name (English)';
    case 'targetPrice': return 'Target Price';
    case 'status': return 'Status';
    default: return 'unknown';
  }
}

export function getInvoice(state: RootState, id: number): string {
  return getSummary<InvoiceSummary>(
    state, SummaryCollections.Invoices, id,
  )?.companyName ?? '...';
}
