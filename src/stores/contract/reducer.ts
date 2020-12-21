import ResourceStatus from '../resourceStatus';
import * as actionCreators from './actionCreators';
import { ContractActionType } from './actions';
import { ContractState } from './state';

const initialState: ContractState = {
  single: undefined,
  singleStatus: ResourceStatus.EMPTY,
};

type ContractAction = ReturnType<typeof actionCreators[keyof typeof actionCreators]>;

export default function contractReducer(
  state: ContractState = initialState, action: ContractAction,
): ContractState {
  switch (action.type) {
    case ContractActionType.FetchSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.FETCHING,
      };

    case ContractActionType.CreateSingle:
    case ContractActionType.SaveSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.SAVING,
      };

    case ContractActionType.SetSingle:
      return {
        ...state,
        single: action.contract,
        singleStatus: ResourceStatus.FETCHED,
      };

    case ContractActionType.ErrorSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.ERROR,
      };

    case ContractActionType.ClearSingle:
      return {
        ...state,
        single: undefined,
        singleStatus: ResourceStatus.EMPTY,
      };

    default:
      return state;
  }
}
