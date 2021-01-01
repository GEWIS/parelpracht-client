import { ListOrFilter } from '../../clients/server.generated';
import {
  tableActionPattern,
  TableActionType, TableChangeSortAction,
  TableClearAction, TableFetchAction,
  TableNextPageAction, TablePrevPageAction,
  TableSearchAction, TableSetAction, TableSetFilterAction, TableSetTakeAction,
} from './actions';
import { Tables } from './tables';

export function fetchTable<T extends Tables>(table: T): TableFetchAction<T> {
  return { type: tableActionPattern(table, TableActionType.Fetch) };
}

export function setTable<T extends Tables, R>(
  table: T, data: R[], count: number,
): TableSetAction<T, R> {
  return {
    type: tableActionPattern(table, TableActionType.Set),
    data,
    count,
  };
}

export function clearTable<T extends Tables>(table: T): TableClearAction<T> {
  return { type: tableActionPattern(table, TableActionType.Clear) };
}

export function changeSortTable<T extends Tables>(
  table: T, column: string,
): TableChangeSortAction<T> {
  return { type: tableActionPattern(table, TableActionType.ChangeSort), column };
}

export function setTakeTable<T extends Tables>(
  table: T, take: number,
): TableSetTakeAction<T> {
  return { type: tableActionPattern(table, TableActionType.SetTake), take };
}

export function searchTable<T extends Tables>(
  table: T, search: string,
): TableSearchAction<T> {
  return { type: tableActionPattern(table, TableActionType.Search), search };
}

export function nextPageTable<T extends Tables>(table: T): TableNextPageAction<T> {
  return { type: tableActionPattern(table, TableActionType.NextPage) };
}

export function prevPageTable<T extends Tables>(table: T): TablePrevPageAction<T> {
  return { type: tableActionPattern(table, TableActionType.PrevPage) };
}

export function setFilterTable<T extends Tables>(
  table: T, filter: ListOrFilter,
): TableSetFilterAction<T> {
  return { type: tableActionPattern(table, TableActionType.SetFilter), ...filter };
}
