import ResourceStatus from '../resourceStatus';
import * as actionCreators from './actionCreators';
import { ProductActionType } from './actions';
import { ProductState } from './state';

const initialState: ProductState = {
  list: [],
  listStatus: ResourceStatus.EMPTY,
  listSortColumn: 'id',
  listSortDirection: 'asc',

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
        listStatus: ResourceStatus.FETCHED,
      };

    case ProductActionType.Clear:
      return {
        ...state,
        list: [],
        listStatus: ResourceStatus.EMPTY,
      };

    case ProductActionType.ChangeSort:
      if (state.listSortColumn === action.column) {
        if (state.listSortDirection === 'desc') {
          return { ...state, listSortColumn: 'id', listSortDirection: 'asc' };
        }

        return {
          ...state,
          listSortDirection: 'desc',
        };
      }

      return {
        ...state,
        listSortColumn: action.column,
        listSortDirection: 'asc',
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
