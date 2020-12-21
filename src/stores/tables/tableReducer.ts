import ResourceStatus from '../resourceStatus';
import { TableState } from './tableState';
import {
  TableActions, TableActionType, TableChangeSortAction,
  tableExtractAction,
  TableSearchAction, TableSetAction, TableSetTakeAction,
} from './actions';
import { Tables } from './tables';

const initialState = {
  data: [],
  count: 0,
  status: ResourceStatus.EMPTY,
  lastUpdated: new Date(),

  sortColumn: 'id',
  sortDirection: 'ASC' as 'ASC' | 'DESC',
  skip: 0,
  take: 10,
  search: '',
};

const createTableReducer = <T extends Tables, R>(t: Tables) => {
  return (
    state: TableState<R> = initialState,
    action: TableActions<T, R>,
  ): TableState<R> => {
    // Check if action is table action
    if (action.type.split('/')[0] !== 'Table') {
      return state;
    }
    const { type, table } = tableExtractAction(action.type);
    // Filter on table
    if (table !== t) {
      return state;
    }

    switch (type) {
      case TableActionType.Fetch:
        return {
          ...state,
          status: ResourceStatus.FETCHING,
        };

      case TableActionType.Set: {
        const a = action as TableSetAction<T, R>;
        return {
          ...state,
          data: a.data,
          count: a.count,
          status: ResourceStatus.FETCHED,
          lastUpdated: new Date(),
        };
      }

      case TableActionType.Clear:
        return {
          ...state,
          data: [],
          skip: 0,
          status: ResourceStatus.EMPTY,
        };

      case TableActionType.SetTake: {
        const a = action as TableSetTakeAction<T>;
        return {
          ...state,
          skip: 0,
          take: a.take,
        };
      }

      case TableActionType.Search: {
        const a = action as TableSearchAction<T>;
        return {
          ...state,
          skip: 0,
          search: a.search,
        };
      }

      case TableActionType.NextPage:
        if (state.skip + state.take < state.count) {
          return {
            ...state,
            skip: state.skip + state.take,
          };
        }
        return state;

      case TableActionType.PrevPage:
        if (state.skip > 0) {
          return {
            ...state,
            skip: Math.max(state.skip - state.take, 0),
          };
        }
        return state;

      case TableActionType.ChangeSort: {
        const a = action as TableChangeSortAction<T>;
        if (state.sortColumn === a.column) {
          if (state.sortDirection === 'DESC') {
            return {
              ...state,
              skip: 0,
              sortColumn: 'id',
              sortDirection: 'ASC',
            };
          }

          return {
            ...state,
            skip: 0,
            sortDirection: 'DESC',
          };
        }

        return {
          ...state,
          skip: 0,
          sortColumn: a.column,
          sortDirection: 'ASC',
        };
      }
      default:
        return state;
    }
  };
};

export default createTableReducer;
