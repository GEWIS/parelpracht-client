import { combineReducers } from 'redux';
import { Product } from '../../clients/server.generated';
import tableReducer from './tableReducer';
import { Tables } from './tables';
import { TableState } from './tableState';

export interface TablesState {
  [Tables.Products]: TableState<Product>;
}

export const tablesReducer = combineReducers<TablesState>({
  [Tables.Products]: tableReducer,
});
