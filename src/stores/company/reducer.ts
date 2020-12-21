import ResourceStatus from '../resourceStatus';
import * as actionCreators from './actionCreators';
import { CompanyActionType } from './actions';
import { CompanyState } from './state';

const initialState: CompanyState = {
  single: undefined,
  singleStatus: ResourceStatus.EMPTY,
};

type CompanyAction = ReturnType<typeof actionCreators[keyof typeof actionCreators]>;

export default function companyReducer(
  state: CompanyState = initialState, action: CompanyAction,
): CompanyState {
  switch (action.type) {
    case CompanyActionType.CreateSingle:
    case CompanyActionType.SaveSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.SAVING,
      };

    case CompanyActionType.SetSingle:
      return {
        ...state,
        single: action.company,
        singleStatus: ResourceStatus.FETCHED,
      };

    case CompanyActionType.ErrorSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.ERROR,
      };

    case CompanyActionType.ClearSingle:
      return {
        ...state,
        single: undefined,
        singleStatus: ResourceStatus.EMPTY,
      };

    default:
      return state;
  }
}
