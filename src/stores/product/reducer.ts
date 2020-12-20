import ResourceStatus from '../resourceStatus';
import * as actionCreators from './actionCreators';
import { ProductActionType } from './actions';
import { ProductState } from './state';

const initialState: ProductState = {
  list: [],
  listCount: 0,
  listStatus: ResourceStatus.EMPTY,

  listSortColumn: 'id',
  listSortDirection: 'ASC',
  listLastUpdated: new Date(),
  listSkip: 0,
  listTake: 10,
  listSearch: '',

  single: undefined,
  singleStatus: ResourceStatus.EMPTY,
};

type ProductAction = ReturnType<typeof actionCreators[keyof typeof actionCreators]>;

export default function productReducer(
  state: ProductState = initialState, action: ProductAction,
): ProductState {
  switch (action.type) {
    case ProductActionType.Fetch:
      return {
        ...state,
        listStatus: ResourceStatus.FETCHING,
      };

    case ProductActionType.Set:
      return {
        ...state,
        list: action.products,
        listCount: action.count,
        listStatus: ResourceStatus.FETCHED,
        listLastUpdated: new Date(),
      };

    case ProductActionType.Clear:
      return {
        ...state,
        list: [],
        listSkip: 0,
        listStatus: ResourceStatus.EMPTY,
      };

    case ProductActionType.SetTake:
      return {
        ...state,
        listSkip: 0,
        listTake: action.take,
      };

    case ProductActionType.Search:
      return {
        ...state,
        listSkip: 0,
        listSearch: action.search,
      };

    case ProductActionType.NextPage:
      if (state.listSkip + state.listTake < state.listCount) {
        return {
          ...state,
          listSkip: state.listSkip + state.listTake,
        };
      }
      return state;

    case ProductActionType.PrevPage:
      if (state.listSkip > 0) {
        return {
          ...state,
          listSkip: Math.max(state.listSkip - state.listTake, 0),
        };
      }
      return state;

    case ProductActionType.ChangeSort:
      if (state.listSortColumn === action.column) {
        if (state.listSortDirection === 'DESC') {
          return {
            ...state,
            listSkip: 0,
            listSortColumn: 'id',
            listSortDirection: 'ASC',
          };
        }

        return {
          ...state,
          listSkip: 0,
          listSortDirection: 'DESC',
        };
      }

      return {
        ...state,
        listSkip: 0,
        listSortColumn: action.column,
        listSortDirection: 'ASC',
      };

    case ProductActionType.FetchSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.FETCHING,
      };

    case ProductActionType.CreateSingle:
    case ProductActionType.SaveSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.SAVING,
      };

    case ProductActionType.SetSingle:
      return {
        ...state,
        single: action.product,
        singleStatus: ResourceStatus.FETCHED,
      };

    case ProductActionType.ErrorSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.ERROR,
      };

    case ProductActionType.ClearSingle:
      return {
        ...state,
        single: undefined,
        singleStatus: ResourceStatus.EMPTY,
      };

    default:
      return state;
  }
}
