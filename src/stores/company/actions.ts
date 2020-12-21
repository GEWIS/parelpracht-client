import type { Action } from 'redux';
import type { Company, CompanyParams } from '../../clients/server.generated';

// Action types
export enum CompanyActionType {
  Fetch = 'Companies/Fetch',
  Set = 'Companies/Set',
  Clear = 'Companies/Clear',
  ChangeSort = 'Companies/ChangeSort',
  NextPage = 'Companies/NextPage',
  PrevPage = 'Companies/PrevPage',
  SetTake = 'Companies/SetTake',
  Search = 'Companies/Search',

  FetchSingle = 'Companies/FetchSingle',
  SetSingle = 'Companies/SetSingle',
  SaveSingle = 'Companies/SaveSingle',
  ErrorSingle = 'Companies/ErrorSingle',
  CreateSingle = 'Companies/CreateSingle',
  ClearSingle = 'Companies/ClearSingle',
}

// Actions
export type CompaniesFetchAction = Action<CompanyActionType.Fetch>;

export type CompaniesSetAction = Action<CompanyActionType.Set> & {
  companies: Company[],
  count: number,
};

export type CompaniesClearAction = Action<CompanyActionType.Clear>;

export type CompaniesChangeSortAction = Action<CompanyActionType.ChangeSort> & {
  column: string;
};

export type CompaniesSetTakeAction = Action<CompanyActionType.SetTake> & {
  take: number;
};

export type CompaniesSearchAction = Action<CompanyActionType.Search> & {
  search: string;
};

export type CompaniesNextPageAction = Action<CompanyActionType.NextPage>;
export type CompaniesPrevPageAction = Action<CompanyActionType.PrevPage>;

export type CompaniesFetchSingleAction = Action<CompanyActionType.FetchSingle> & {
  id: number,
};

export type CompaniesSetSingleAction = Action<CompanyActionType.SetSingle> & {
  company: Company,
};

export type CompaniesSaveSingleAction = Action<CompanyActionType.SaveSingle> & {
  id: number
  company: CompanyParams,
};

export type CompaniesErrorSingleAction = Action<CompanyActionType.ErrorSingle>;

export type CompaniesCreateSingleAction = Action<CompanyActionType.CreateSingle> & {
  company: CompanyParams,
};

export type CompaniesClearSingleAction = Action<CompanyActionType.ClearSingle>;
