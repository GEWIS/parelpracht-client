import { Contract } from '../../clients/server.generated';
import { RootState } from '../store';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';

export function sortColumn(state: RootState): string {
  const column = getTable<Contract>(state, Tables.Contracts).sortColumn;
  switch (column) {
    case 'id': return 'ID';
    case 'title': return 'Title';
    case 'date': return 'Date';
    case 'poNumber': return 'PO Number';
    default: return 'unknown';
  }
}
