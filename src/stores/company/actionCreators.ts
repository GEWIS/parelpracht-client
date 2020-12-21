import { Company, CompanyParams } from '../../clients/server.generated';
import {
  CompanyActionType, CompaniesClearSingleAction,
  CompaniesCreateSingleAction,
  CompaniesErrorSingleAction,
  CompaniesFetchSingleAction, CompaniesSaveSingleAction,
  CompaniesSetSingleAction,
} from './actions';

// Action creators
export function fetchSingleCompany(id: number): CompaniesFetchSingleAction {
  return { type: CompanyActionType.FetchSingle, id };
}
export function setSingleCompany(company: Company): CompaniesSetSingleAction {
  return { type: CompanyActionType.SetSingle, company };
}

export function saveSingleCompany(id: number, company: CompanyParams): CompaniesSaveSingleAction {
  return { type: CompanyActionType.SaveSingle, id, company };
}

export function errorSingleCompany(): CompaniesErrorSingleAction {
  return { type: CompanyActionType.ErrorSingle };
}

export function createSingleCompany(company: CompanyParams): CompaniesCreateSingleAction {
  return { type: CompanyActionType.CreateSingle, company };
}

export function clearSingleCompany(): CompaniesClearSingleAction {
  return { type: CompanyActionType.ClearSingle };
}
