import { combineReducers } from 'redux';
import {
  Company, Product, Contract, Contact, Invoice, User, ProductCategory,
} from '../../clients/server.generated';
import createTableReducer from './tableReducer';
import { Tables } from './tables';
import { TableState } from './tableState';
import { ETCompany } from '../../helpers/extensiveTableObjects';

export interface TablesState {
  [Tables.Products]: TableState<Product>;
  [Tables.ProductCategories]: TableState<ProductCategory>
  [Tables.Contacts]: TableState<Contact>;
  [Tables.Companies]: TableState<Company>;
  [Tables.Contracts]: TableState<Contract>;
  [Tables.ETCompanies]: TableState<ETCompany>;
  [Tables.Invoices]: TableState<Invoice>;
  [Tables.Users]: TableState<User>;
}

export const tablesReducer = combineReducers<TablesState>({
  [Tables.Products]: createTableReducer(Tables.Products),
  [Tables.Contacts]: createTableReducer(Tables.Contacts),
  [Tables.ProductCategories]: createTableReducer(Tables.ProductCategories),
  [Tables.Companies]: createTableReducer(Tables.Companies),
  [Tables.Contracts]: createTableReducer(Tables.Contracts),
  [Tables.ETCompanies]: createTableReducer(Tables.ETCompanies),
  [Tables.Invoices]: createTableReducer(Tables.Invoices),
  [Tables.Users]: createTableReducer(Tables.Users),
});
