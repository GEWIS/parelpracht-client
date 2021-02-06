import { combineReducers } from 'redux';
import {
  CategorySummary,
  CompanySummary, ContactSummary, ContractSummary,
  InvoiceSummary, ProductSummary, UserSummary,
} from '../../clients/server.generated';
import { SummaryCollections } from './summaries';
import createSummariesReducer from './summariesReducer';
import { SummaryCollectionState } from './summariesState';

export interface SummariesState {
  [SummaryCollections.Products]: SummaryCollectionState<ProductSummary>;
  [SummaryCollections.Contacts]: SummaryCollectionState<ContactSummary>;
  [SummaryCollections.Companies]: SummaryCollectionState<CompanySummary>;
  [SummaryCollections.ProductCategories]: SummaryCollectionState<CategorySummary>;
  [SummaryCollections.Contracts]: SummaryCollectionState<ContractSummary>;
  [SummaryCollections.Invoices]: SummaryCollectionState<InvoiceSummary>;
  [SummaryCollections.Users]: SummaryCollectionState<UserSummary>;
}

export const summariesReducer = combineReducers<SummariesState>({
  [SummaryCollections.Products]: createSummariesReducer(SummaryCollections.Products),
  [SummaryCollections.Contacts]: createSummariesReducer(SummaryCollections.Contacts),
  [SummaryCollections.Companies]: createSummariesReducer(SummaryCollections.Companies),
  [SummaryCollections.ProductCategories]:
    createSummariesReducer(SummaryCollections.ProductCategories),
  [SummaryCollections.Contracts]: createSummariesReducer(SummaryCollections.Contracts),
  [SummaryCollections.Invoices]: createSummariesReducer(SummaryCollections.Invoices),
  [SummaryCollections.Users]: createSummariesReducer(SummaryCollections.Users),
});
