import { Contact, VATSummary } from '../../clients/server.generated';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import i18n from '../../localization';

export function sortColumn(state: RootState): string {
  const column = getTable<Contact>(state, Tables.ValueAddedTax).sortColumn;
  switch (column) {
    case 'id': return i18n.t('entities.generalProps.ID');
    case 'name': return i18n.t('entities.category.props.name').toLowerCase();
    default: return i18n.t('entities.generalProps.unknown').toLowerCase();
  }
}

export function getValueAddedTaxAmount(state: RootState, id: number): number {
  const valueAddedTax = getSummary<VATSummary>(
    state, SummaryCollections.ValueAddedTax, id,
  );
  if (valueAddedTax === undefined) return -1;
  return valueAddedTax.amount;
}
