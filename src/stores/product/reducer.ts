import ResourceStatus from '../resourceStatus';
import * as actionCreators from './actionCreators';
import { ProductActionType } from './actions';
import { ProductState } from './state';

const initialState: ProductState = {
  single: undefined,
  singleStatus: ResourceStatus.EMPTY,
};

type ProductAction = ReturnType<typeof actionCreators[keyof typeof actionCreators]>;

export default function productReducer(
  state: ProductState = initialState, action: ProductAction,
): ProductState {
  switch (action.type) {
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
