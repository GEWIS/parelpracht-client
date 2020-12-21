import { Invoice } from '../../clients/server.generated';
import { RootState } from '../store';
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
