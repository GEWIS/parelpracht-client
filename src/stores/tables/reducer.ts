import { combineReducers } from 'redux';
import { Company, Product, Contract, Contact, Invoice } from '../../clients/server.generated';
import createTableReducer from './tableReducer';
import { Tables } from './tables';
import { TableState } from './tableState';

export interface TablesState {
  [Tables.Products]: TableState<Product>;
  [Tables.Contacts]: TableState<Contact>;
  [Tables.Companies]: TableState<Company>;
  [Tables.Contracts]: TableState<Contract>;
  [Tables.Invoices]: TableState<Invoice>;
}

export const tablesReducer = combineReducers<TablesState>({
  [Tables.Products]: createTableReducer(Tables.Products),
  [Tables.Contacts]: createTableReducer(Tables.Contacts),
  [Tables.Companies]: createTableReducer(Tables.Companies),
  [Tables.Contracts]: createTableReducer(Tables.Contracts),
  [Tables.Invoices]: createTableReducer(Tables.Invoices),
});
