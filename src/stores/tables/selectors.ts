import type { RootState } from '../store';
import type { Tables } from './tables';
import type { ListFilter, TableState } from './tableState';

export function getTable<R>(state: RootState, table: Tables): TableState<R> {
  return state.tables[table] as any;
}

export function countFetched(state: RootState, table: Tables): number {
  return getTable(state, table).data.length;
}

export function countTotal(state: RootState, table: Tables): number {
  return getTable(state, table).count;
}

export function isFilterOn(state: RootState, table: Tables, column: string): boolean {
  return getTable(state, table).filters.find((f) => f.column === column) !== undefined;
}

export function getFilter(state: RootState, table: Tables, column: string): ListFilter {
  return getTable(state, table).filters.find((f) => f.column === column) ?? { column, values: [] };
}
