import { ContractStatus, Invoice, InvoiceStatus, InvoiceSummary } from '../../clients/server.generated';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import i18n from '../../localization';

export function sortColumn(state: RootState): string {
  const column = getTable<Invoice>(state, Tables.Invoices).sortColumn;
  switch (column) {
    case 'id': return i18n.t('entities.generalProps.ID');
    case 'title': return i18n.t('entities.invoice.props.title').toLowerCase();
    case 'company': return i18n.t('entity.company').toLowerCase();
    case 'startDate': return i18n.t('entities.invoice.props.financialYear').toLowerCase();
    case 'updatedAt': return i18n.t('entities.generalProps.lastUpdate').toLowerCase();
    default: return i18n.t('entities.generalProps.unknown').toLowerCase();
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
  )?.status ?? '...' as InvoiceStatus;
}

export function getInvoiceValue(state: RootState, id: number): number {
  return getSummary<InvoiceSummary>(
    state, SummaryCollections.Invoices, id,
  )?.value ?? undefined;
}

export function getTreasurerLastSeen(state: RootState): Date | undefined {
  return getTable(state, Tables.Invoices).lastSeen;
}
