import type { Action } from 'redux';
import type { Invoice, InvoiceParams } from '../../clients/server.generated';

// Action types
export enum InvoiceActionType {
  FetchSingle = 'Invoices/FetchSingle',
  SetSingle = 'Invoices/SetSingle',
  SaveSingle = 'Invoices/SaveSingle',
  ErrorSingle = 'Invoices/ErrorSingle',
  CreateSingle = 'Invoices/CreateSingle',
  ClearSingle = 'Invoices/ClearSingle',
}

// Actions

export type InvoicesFetchSingleAction = Action<InvoiceActionType.FetchSingle> & {
  id: number,
};

export type InvoicesSetSingleAction = Action<InvoiceActionType.SetSingle> & {
  invoice: Invoice,
};

export type InvoicesSaveSingleAction = Action<InvoiceActionType.SaveSingle> & {
  id: number
  invoice: InvoiceParams,
};

export type InvoicesErrorSingleAction = Action<InvoiceActionType.ErrorSingle>;

export type InvoicesCreateSingleAction = Action<InvoiceActionType.CreateSingle> & {
  invoice: InvoiceParams,
};

export type InvoicesClearSingleAction = Action<InvoiceActionType.ClearSingle>;
