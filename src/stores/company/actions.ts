import type { Action } from 'redux';
import type { Company, CompanyParams } from '../../clients/server.generated';

// Action types
export enum CompanyActionType {
  FetchSingle = 'Companies/FetchSingle',
  SetSingle = 'Companies/SetSingle',
  SaveSingle = 'Companies/SaveSingle',
  ErrorSingle = 'Companies/ErrorSingle',
  CreateSingle = 'Companies/CreateSingle',
  ClearSingle = 'Companies/ClearSingle',
}

// Actions
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
