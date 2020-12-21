import { Action } from 'redux';
import { ActionPattern } from 'redux-saga/effects';
import { Tables } from './tables';

export enum TableActionType {
  Fetch = 'Table/Fetch',
  Set = 'Table/Set',
  Clear = 'Table/Clear',
  ChangeSort = 'Table/ChangeSort',
  NextPage = 'Table/NextPage',
  PrevPage = 'Table/PrevPage',
  SetTake = 'Table/SetTake',
  Search = 'Table/Search',
}

type TableAction<A, T> = Action<{type: A, table: T}>;

export type TableFetchAction<T> = TableAction<TableActionType.Fetch, T>;

export type TableSetAction<T, R> = TableAction<TableActionType.Set, T> & {
  data: R[],
  count: number,
};

export type TableClearAction<T> = TableAction<TableActionType.Clear, T>;

export type TableChangeSortAction<T> = TableAction<TableActionType.ChangeSort, T> & {
  column: string;
};

export type TableSetTakeAction<T> = TableAction<TableActionType.SetTake, T> & {
  take: number;
};

export type TableSearchAction<T> = TableAction<TableActionType.Search, T> & {
  search: string;
};

export type TableNextPageAction<T> = TableAction<TableActionType.NextPage, T>;
export type TablePrevPageAction<T> = TableAction<TableActionType.PrevPage, T>;

export type TableActions<T extends Tables, R> =
  TableFetchAction<T> | TableSetAction<T, R> | TableClearAction<T>
  | TableChangeSortAction<T> | TableSetTakeAction<T> | TableSearchAction<T>
  | TableNextPageAction<T> | TablePrevPageAction<T>;

export const tableAction = <T extends Tables>(
  table: T, action: TableActionType,
): ActionPattern<TableAction<any, T>> => {
  return { type: action, table, toString: () => `${action}[${table}]` } as any;
};
