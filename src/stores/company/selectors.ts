import { RootState } from '../store';

export function countFetchedCompanies(state: RootState): number {
  return state.company.list.length;
}

export function countTotalCompanies(state: RootState): number {
  return state.company.listCount;
}

export function sortColumn(state: RootState): string {
  const column = state.company.listSortColumn;
  switch (column) {
    case 'id': return 'ID';
    case 'nameDutch': return 'Name (Dutch)';
    case 'nameEnglish': return 'Name (English)';
    case 'targetPrice': return 'Target Price';
    case 'status': return 'Status';
    default: return 'unknown';
  }
}
