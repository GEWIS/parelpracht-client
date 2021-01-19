import { combineReducers } from 'redux';
import {
  Company, Product, Contract, Contact, Invoice, User,
} from '../../clients/server.generated';
import createTableReducer from './tableReducer';
import { Tables } from './tables';
import { TableState } from './tableState';
import { ETContract } from '../../helpers/extensiveTableObjects';

export interface TablesState {
  [Tables.Products]: TableState<Product>;
  [Tables.Contacts]: TableState<Contact>;
  [Tables.Companies]: TableState<Company>;
  [Tables.Contracts]: TableState<Contract>;
  [Tables.ETContracts]: TableState<ETContract>;
  [Tables.Invoices]: TableState<Invoice>;
  [Tables.Users]: TableState<User>;
}

export const tablesReducer = combineReducers<TablesState>({
  [Tables.Products]: createTableReducer(Tables.Products),
  [Tables.Contacts]: createTableReducer(Tables.Contacts),
  [Tables.Companies]: createTableReducer(Tables.Companies),
  [Tables.Contracts]: createTableReducer(Tables.Contracts),
  [Tables.ETContracts]: createTableReducer(Tables.ETContracts),
  [Tables.Invoices]: createTableReducer(Tables.Invoices),
  [Tables.Users]: createTableReducer(Tables.Users),
});
