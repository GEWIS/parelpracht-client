import { Invoice, InvoiceParams } from '../../clients/server.generated';
import {
  InvoiceActionType, InvoicesClearSingleAction,
  InvoicesCreateSingleAction,
  InvoicesErrorSingleAction,
  InvoicesFetchSingleAction,
  InvoicesSaveSingleAction,
  InvoicesSetSingleAction,
} from './actions';

// Action creators

export function fetchSingleInvoice(id: number): InvoicesFetchSingleAction {
  return { type: InvoiceActionType.FetchSingle, id };
}
export function setSingleInvoice(invoice: Invoice): InvoicesSetSingleAction {
  return { type: InvoiceActionType.SetSingle, invoice };
}

export function saveSingleInvoice(id: number, invoice: InvoiceParams): InvoicesSaveSingleAction {
  return { type: InvoiceActionType.SaveSingle, id, invoice };
}

export function errorSingleInvoice(): InvoicesErrorSingleAction {
  return { type: InvoiceActionType.ErrorSingle };
}

export function createSingleInvoice(invoice: InvoiceParams): InvoicesCreateSingleAction {
  return { type: InvoiceActionType.CreateSingle, invoice };
}

export function clearSingleInvoice(): InvoicesClearSingleAction {
  return { type: InvoiceActionType.ClearSingle };
}
