import { GeneralState } from './state';
import * as actionCreators from './actionCreators';
import { GeneralActionType } from './actions';

const initialState: GeneralState = {
  financialYears: [],
};

type GeneralAction = ReturnType<typeof actionCreators[keyof typeof actionCreators]>;

export default function generalReducer(
  state: GeneralState = initialState, action: GeneralAction,
): GeneralState {
  switch (action.type) {
    case GeneralActionType.SetInfo:
      return {
        ...state,
        financialYears: action.financialYears,
      };
    default:
      return state;
  }
}
