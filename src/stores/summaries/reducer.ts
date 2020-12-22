import { combineReducers } from 'redux';
import {
  Company, Product, Contract, Contact, Invoice,
} from '../../clients/server.generated';
import { SummaryCollections } from './summaries';
import createSummariesReducer from './summariesReducer';
import { SummaryBase, SummaryCollectionState } from './summariesState';

export interface SummariesState {
  [SummaryCollections.Products]: SummaryCollectionState<SummaryBase>;
  [SummaryCollections.Contacts]: SummaryCollectionState<SummaryBase>;
  [SummaryCollections.Companies]: SummaryCollectionState<SummaryBase>;
  [SummaryCollections.Contracts]: SummaryCollectionState<SummaryBase>;
  [SummaryCollections.Invoices]: SummaryCollectionState<SummaryBase>;
}

export const summariesReducer = combineReducers<SummariesState>({
  [SummaryCollections.Products]: createSummariesReducer(SummaryCollections.Products),
  [SummaryCollections.Contacts]: createSummariesReducer(SummaryCollections.Contacts),
  [SummaryCollections.Companies]: createSummariesReducer(SummaryCollections.Companies),
  [SummaryCollections.Contracts]: createSummariesReducer(SummaryCollections.Contracts),
  [SummaryCollections.Invoices]: createSummariesReducer(SummaryCollections.Invoices),
});
