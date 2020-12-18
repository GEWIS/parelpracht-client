import ResourceStatus from '../resourceStatus';
import * as actionCreators from './actionCreators';
import { ProductActionType } from './actions';
import { ProductState } from './state';

const initialState: ProductState = {
  list: [],
  listStatus: ResourceStatus.EMPTY,

  single: undefined,
  singleStatus: ResourceStatus.EMPTY,
};

type ProductAction = ReturnType<typeof actionCreators[keyof typeof actionCreators]>;

export default function productReducer(
  state: ProductState = initialState, action: ProductAction,
): ProductState {
  switch (action.type) {
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
