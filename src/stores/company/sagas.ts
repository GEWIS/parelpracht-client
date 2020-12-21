import {
  call, put, select, takeEvery, throttle,
} from 'redux-saga/effects';
import { Client, Company, Dir2 } from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import type { RootState } from '../store';
import { fetchTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';
import {
  setSingleCompany, errorSingleCompany,
} from './actionCreators';
import {
  CompanyActionType, CompaniesCreateSingleAction, CompaniesFetchSingleAction,
  CompaniesSaveSingleAction,
} from './actions';

function* fetchCompanies() {
  const client = new Client();

  const state: TableState<Company> = yield select(getTable, Tables.Companies);
  const {
    sortColumn, sortDirection,
    take, skip,
    search,
  } = state;

  const { list, count } = yield call(
    [client, client.getAllCompanies], sortColumn, sortDirection as Dir2,
    skip, take, search,
  );
  yield put(setTable(Tables.Companies, list, count));
}

function* fetchSingleCompany(action: CompaniesFetchSingleAction) {
  const client = new Client();
  const company = yield call([client, client.getCompany], action.id);
  yield put(setSingleCompany(company));
}

function* saveSingleCompany(action: CompaniesSaveSingleAction) {
  const client = new Client();
  yield call([client, client.updateCompany], action.id, action.company);
  const company = yield call([client, client.getCompany], action.id);
  yield put(setSingleCompany(company));
}

function* errorSaveSingleCompany() {
  yield put(errorSingleCompany());
}

function* watchSaveSingleCompany() {
  yield takeEveryWithErrorHandling(
    CompanyActionType.SaveSingle,
    saveSingleCompany,
    { onErrorSaga: errorSaveSingleCompany },
  );
}

function* createSingleCompany(action: CompaniesCreateSingleAction) {
  const client = new Client();
  const company = yield call([client, client.createCompany], action.company);
  yield put(setSingleCompany(company));
  yield put(fetchTable(Tables.Companies));
}

function* errorCreateSingleCompany() {
  yield put(errorSingleCompany());
}

function* watchCreateSingleCompany() {
  yield takeEveryWithErrorHandling(
    CompanyActionType.CreateSingle,
    createSingleCompany,
    { onErrorSaga: errorCreateSingleCompany },
  );
}

export default [
  function* watchFetchCompanies() {
    yield throttle(
      500,
      tableActionPattern(Tables.Companies, TableActionType.Fetch),
      fetchCompanies,
    );
  },
  function* watchFetchSingleCompany() {
    yield takeEveryWithErrorHandling(CompanyActionType.FetchSingle, fetchSingleCompany);
  },
  watchSaveSingleCompany,
  watchCreateSingleCompany,
];
