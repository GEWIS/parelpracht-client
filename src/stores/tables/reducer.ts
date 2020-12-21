import { combineReducers } from 'redux';
import { Company, Product } from '../../clients/server.generated';
import createTableReducer from './tableReducer';
import { Tables } from './tables';
import { TableState } from './tableState';

export interface TablesState {
  [Tables.Products]: TableState<Product>;
  [Tables.Companies]: TableState<Company>;
}

export const tablesReducer = combineReducers<TablesState>({
  [Tables.Products]: createTableReducer(Tables.Products),
  [Tables.Companies]: createTableReducer(Tables.Companies),
});
