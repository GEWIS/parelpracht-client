import { GeneralState } from './state';
import * as actionCreators from './actionCreators';
import { GeneralActionType } from './actions';
import { LoginMethods } from '../../clients/server.generated';

const initialState: GeneralState = {
  loginMethod: LoginMethods.Local,
  financialYears: [],
};

type GeneralAction = ReturnType<typeof actionCreators[keyof typeof actionCreators]>;

export default function generalReducer(
  state: GeneralState = initialState, action: GeneralAction,
): GeneralState {
  switch (action.type) {
    case GeneralActionType.SetPrivateInfo:
      return {
        ...state,
        financialYears: action.financialYears,
      };
    case GeneralActionType.SetPublicInfo:
      return {
        ...state,
        loginMethod: action.loginMethod,
      };
    default:
      return state;
  }
}
