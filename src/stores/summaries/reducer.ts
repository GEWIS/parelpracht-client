import { combineReducers } from 'redux';
import {
  CompanySummary, ContactSummary, ContractSummary, InvoiceSummary, ProductSummary, UserSummary,
} from '../../clients/server.generated';
import { SummaryCollections } from './summaries';
import createSummariesReducer from './summariesReducer';
import { SummaryBase, SummaryCollectionState } from './summariesState';

export interface SummariesState {
  [SummaryCollections.Products]: SummaryCollectionState<ProductSummary>;
  [SummaryCollections.Contacts]: SummaryCollectionState<ContactSummary>;
  [SummaryCollections.Companies]: SummaryCollectionState<CompanySummary>;
  [SummaryCollections.Contracts]: SummaryCollectionState<ContractSummary>;
  [SummaryCollections.Invoices]: SummaryCollectionState<InvoiceSummary>;
  [SummaryCollections.Users]: SummaryCollectionState<UserSummary>;
}

export const summariesReducer = combineReducers<SummariesState>({
  [SummaryCollections.Products]: createSummariesReducer(SummaryCollections.Products),
  [SummaryCollections.Contacts]: createSummariesReducer(SummaryCollections.Contacts),
  [SummaryCollections.Companies]: createSummariesReducer(SummaryCollections.Companies),
  [SummaryCollections.Contracts]: createSummariesReducer(SummaryCollections.Contracts),
  [SummaryCollections.Invoices]: createSummariesReducer(SummaryCollections.Invoices),
  [SummaryCollections.Users]: createSummariesReducer(SummaryCollections.Users),
});
