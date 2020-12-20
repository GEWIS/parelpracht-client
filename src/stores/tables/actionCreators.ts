import {
  TableActionType, TableChangeSortAction,
  TableClearAction, TableFetchAction,
  TableNextPageAction, TablePrevPageAction,
  TableSearchAction, TableSetAction, TableSetTakeAction,
} from './actions';
import { Tables } from './tables';

export function fetchTable(table: Tables): TableFetchAction {
  return { type: TableActionType.Fetch, table };
}

export function setTable<R>(table: Tables, data: R[], count: number): TableSetAction<R> {
  return {
    type: TableActionType.Set,
    table,
    data,
    count,
  };
}

export function clearTable(table: Tables): TableClearAction {
  return { type: TableActionType.Clear, table };
}

export function changeSortTable(table: Tables, column: string): TableChangeSortAction {
  return { type: TableActionType.ChangeSort, table, column };
}

export function setTakeTable(table: Tables, take: number): TableSetTakeAction {
  return { type: TableActionType.SetTake, table, take };
}

export function searchTable(table: Tables, search: string): TableSearchAction {
  return { type: TableActionType.Search, table, search };
}

export function nextPageTable(table: Tables): TableNextPageAction {
  return { type: TableActionType.NextPage, table };
}

export function prevPageTable(table: Tables): TablePrevPageAction {
  return { type: TableActionType.PrevPage, table };
}
