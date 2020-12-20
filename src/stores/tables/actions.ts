import { Action } from 'redux';
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

type TableAction<T> = Action<T> & {
  table: Tables;
};

export type TableFetchAction = TableAction<TableActionType.Fetch>;

export type TableSetAction<R> = TableAction<TableActionType.Set> & {
  data: R[],
  count: number,
};

export type TableClearAction = TableAction<TableActionType.Clear>;

export type TableChangeSortAction = TableAction<TableActionType.ChangeSort> & {
  column: string;
};

export type TableSetTakeAction = TableAction<TableActionType.SetTake> & {
  take: number;
};

export type TableSearchAction = TableAction<TableActionType.Search> & {
  search: string;
};

export type TableNextPageAction = TableAction<TableActionType.NextPage>;
export type TablePrevPageAction = TableAction<TableActionType.PrevPage>;

export type TableActions<R> =
  TableFetchAction | TableSetAction<R> | TableClearAction
  | TableChangeSortAction | TableSetTakeAction | TableSearchAction
  | TableNextPageAction | TablePrevPageAction;
