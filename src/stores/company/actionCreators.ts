import { Company, CompanyParams } from '../../clients/server.generated';
import {
  CompanyActionType, CompaniesChangeSortAction, CompaniesClearAction, CompaniesClearSingleAction,
  CompaniesCreateSingleAction,
  CompaniesErrorSingleAction,
  CompaniesFetchAction, CompaniesFetchSingleAction, CompaniesNextPageAction,
  CompaniesPrevPageAction, CompaniesSaveSingleAction,
  CompaniesSearchAction,
  CompaniesSetAction, CompaniesSetSingleAction, CompaniesSetTakeAction,
} from './actions';

// Action creators
export function fetchCompanies(): CompaniesFetchAction {
  return { type: CompanyActionType.Fetch };
}
export function setCompanies(companies: Company[], count: number): CompaniesSetAction {
  return { type: CompanyActionType.Set, companies, count };
}

export function clearCompanies(): CompaniesClearAction {
  return { type: CompanyActionType.Clear };
}

export function changeSortCompanies(column: string): CompaniesChangeSortAction {
  return { type: CompanyActionType.ChangeSort, column };
}

export function setTakeCompanies(take: number): CompaniesSetTakeAction {
  return { type: CompanyActionType.SetTake, take };
}

export function searchCompanies(search: string): CompaniesSearchAction {
  return { type: CompanyActionType.Search, search };
}

export function nextPageCompanies(): CompaniesNextPageAction {
  return { type: CompanyActionType.NextPage };
}

export function prevPageCompanies(): CompaniesPrevPageAction {
  return { type: CompanyActionType.PrevPage };
}

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
