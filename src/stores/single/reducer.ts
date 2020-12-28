import { combineReducers } from 'redux';
import {
  Company, Product, Contract, Contact, Invoice, User,
} from '../../clients/server.generated';
import createSingleReducer from './singleReducer';
import { SingleEntities } from './single';
import { SingleEntityState } from './singleState';

export interface SingleEntitiesState {
  [SingleEntities.Product]: SingleEntityState<Product>;
  [SingleEntities.Contact]: SingleEntityState<Contact>;
  [SingleEntities.Company]: SingleEntityState<Company>;
  [SingleEntities.Contract]: SingleEntityState<Contract>;
  [SingleEntities.Invoice]: SingleEntityState<Invoice>;
  [SingleEntities.User]: SingleEntityState<User>;
}

export const singleEntitiesReducer = combineReducers<SingleEntitiesState>({
  [SingleEntities.Product]: createSingleReducer(SingleEntities.Product),
  [SingleEntities.Contact]: createSingleReducer(SingleEntities.Contact),
  [SingleEntities.Company]: createSingleReducer(SingleEntities.Company),
  [SingleEntities.Contract]: createSingleReducer(SingleEntities.Contract),
  [SingleEntities.Invoice]: createSingleReducer(SingleEntities.Invoice),
  [SingleEntities.User]: createSingleReducer(SingleEntities.User),
});
