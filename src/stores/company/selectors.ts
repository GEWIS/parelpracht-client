import { Company } from '../../clients/server.generated';
import { RootState } from '../store';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';

export function sortColumn(state: RootState): string {
  const column = getTable<Company>(state, Tables.Companies).sortColumn;
  switch (column) {
    case 'id': return 'ID';
    case 'name': return 'Name';
    case 'status': return 'Status';
    default: return 'unknown';
  }
}
