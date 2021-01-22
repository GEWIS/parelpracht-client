import { CategorySummary, Contact } from '../../clients/server.generated';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';

export function sortColumn(state: RootState): string {
  const column = getTable<Contact>(state, Tables.ProductCategories).sortColumn;
  switch (column) {
    case 'id': return 'ID';
    case 'name': return 'Name';
    default: return 'unknown';
  }
}

export function getCategoryName(state: RootState, id: number): string {
  const category = getSummary<CategorySummary>(
    state, SummaryCollections.ProductCategories, id,
  );
  if (category === undefined) return '...';
  return category.name;
}
