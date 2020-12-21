import ResourceStatus from '../resourceStatus';
import * as actionCreators from './actionCreators';
import { InvoiceActionType } from './actions';
import { InvoiceState } from './state';

const initialState: InvoiceState = {
  single: undefined,
  singleStatus: ResourceStatus.EMPTY,
};

type InvoiceAction = ReturnType<typeof actionCreators[keyof typeof actionCreators]>;

export default function invoiceReducer(
  state: InvoiceState = initialState, action: InvoiceAction,
): InvoiceState {
  switch (action.type) {
    case InvoiceActionType.FetchSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.FETCHING,
      };

    case InvoiceActionType.CreateSingle:
    case InvoiceActionType.SaveSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.SAVING,
      };

    case InvoiceActionType.SetSingle:
      return {
        ...state,
        single: action.invoice,
        singleStatus: ResourceStatus.FETCHED,
      };

    case InvoiceActionType.ErrorSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.ERROR,
      };

    case InvoiceActionType.ClearSingle:
      return {
        ...state,
        single: undefined,
        singleStatus: ResourceStatus.EMPTY,
      };

    default:
      return state;
  }
}
