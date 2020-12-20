import ResourceStatus from '../resourceStatus';
import { TableState } from './state';
import { TableActions, TableActionType } from './actions';

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

export default function tableReducer<R>(
  state: TableState<R> = initialState,
  action: TableActions<R>,
): TableState<R> {
  switch (action.type) {
    case TableActionType.Fetch:
      return {
        ...state,
        status: ResourceStatus.FETCHING,
      };

    case TableActionType.Set:
      return {
        ...state,
        data: action.data,
        count: action.count,
        status: ResourceStatus.FETCHED,
        lastUpdated: new Date(),
      };

    case TableActionType.Clear:
      return {
        ...state,
        data: [],
        skip: 0,
        status: ResourceStatus.EMPTY,
      };

    case TableActionType.SetTake:
      return {
        ...state,
        skip: 0,
        take: action.take,
      };

    case TableActionType.Search:
      return {
        ...state,
        skip: 0,
        search: action.search,
      };

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

    case TableActionType.ChangeSort:
      if (state.sortColumn === action.column) {
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
        sortColumn: action.column,
        sortDirection: 'ASC',
      };
    default:
      return state;
  }
}
