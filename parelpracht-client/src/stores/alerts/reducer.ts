import * as actionCreators from './actionCreators';
import { ActionTypeNames, Alert, Id } from './actions';

export type AlertItemState = Alert & Id;
export type State = AlertItemState[];
type Actions = ReturnType<(typeof actionCreators)[keyof typeof actionCreators]>;

export default function reducer(state: State = [], action: Actions): State {
  switch (action.type) {
    case ActionTypeNames.ShowAlert:
      return [
        ...state,
        {
          ...action.alert,
        },
      ];
    case ActionTypeNames.HideAlert:
      return state.filter((alert) => alert.id !== action.id);
    // tslint:disable-next-line:no-any
    case '@@router/LOCATION_CHANGE' as any:
      return [];
    default:
      return state;
  }
}
