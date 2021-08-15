import { Product, ProductSummary } from '../../clients/server.generated';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { getLanguage } from '../../localization';

export function sortColumn(state: RootState): string {
  const column = getTable<Product>(state, Tables.Products).sortColumn;
  switch (column) {
    case 'id': return 'ID';
    case 'nameDutch': return 'Name (Dutch)';
    case 'nameEnglish': return 'Name (English)';
    case 'targetPrice': return 'Target Price';
    case 'status': return 'Status';
    case 'category': return 'Category';
    default: return 'unknown';
  }
}

export function getProductName(state: RootState, id: number): string {
  const currentLanguage = getLanguage();

  if (currentLanguage === 'nl-NL') {
    return getSummary<ProductSummary>(
      state, SummaryCollections.Products, id,
    )?.nameDutch ?? '...';
  }
  return getSummary<ProductSummary>(
    state, SummaryCollections.Products, id,
  )?.nameEnglish ?? '...';
}
