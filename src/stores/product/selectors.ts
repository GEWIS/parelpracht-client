import { RootState } from '../store';

export function countFetchedProducts(state: RootState): number {
  return state.product.list.length;
}

export function countTotalProducts(state: RootState): number {
  return state.product.listCount;
}

export function sortColumn(state: RootState): string {
  const column = state.product.listSortColumn;
  switch (column) {
    case 'id': return 'ID';
    case 'nameDutch': return 'Name (Dutch)';
    case 'nameEnglish': return 'Name (English)';
    case 'targetPrice': return 'Target Price';
    case 'status': return 'Status';
    default: return 'unknown';
  }
}
