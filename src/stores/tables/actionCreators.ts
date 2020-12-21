import {
  TableActionType, TableChangeSortAction,
  TableClearAction, TableFetchAction,
  TableNextPageAction, TablePrevPageAction,
  TableSearchAction, TableSetAction, TableSetTakeAction,
} from './actions';
import { Tables } from './tables';

export function fetchTable<T>(table: T): TableFetchAction<T> {
  return { type: { type: TableActionType.Fetch, table } };
}

export function setTable<T, R>(table: T, data: R[], count: number): TableSetAction<T, R> {
  return {
    type: { type: TableActionType.Set, table },
    data,
    count,
  };
}

export function clearTable<T>(table: T): TableClearAction<T> {
  return { type: { type: TableActionType.Clear, table } };
}

export function changeSortTable<T>(table: T, column: string): TableChangeSortAction<T> {
  return { type: { type: TableActionType.ChangeSort, table }, column };
}

export function setTakeTable<T>(table: T, take: number): TableSetTakeAction<T> {
  return { type: { type: TableActionType.SetTake, table }, take };
}

export function searchTable<T>(table: T, search: string): TableSearchAction<T> {
  return { type: { type: TableActionType.Search, table }, search };
}

export function nextPageTable<T>(table: T): TableNextPageAction<T> {
  return { type: { type: TableActionType.NextPage, table } };
}

export function prevPageTable<T>(table: T): TablePrevPageAction<T> {
  return { type: { type: TableActionType.PrevPage, table } };
}
