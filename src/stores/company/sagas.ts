import {
  call, put, select, takeEvery, throttle,
} from 'redux-saga/effects';
import {Client, Dir2} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import type { RootState } from '../store';
import {
  setCompanies, setSingleCompany, fetchCompanies as createFetchCompanies, errorSingleCompany,
} from './actionCreators';
import {
  CompanyActionType, CompaniesCreateSingleAction, CompaniesFetchSingleAction,
  CompaniesSaveSingleAction,
} from './actions';

function* fetchCompanies() {
  const client = new Client();

  const state: RootState = yield select();
  const {
    listSortColumn, listSortDirection,
    listTake, listSkip,
    listSearch,
  } = state.company;

  const { list, count } = yield call(
    [client, client.getAllCompanies], listSortColumn, listSortDirection as Dir2,
    listSkip, listTake, listSearch,
  );
  yield put(setCompanies(list, count));
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
  yield put(createFetchCompanies());
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
    yield throttle(500, CompanyActionType.Fetch, fetchCompanies);
  },
  function* watchFetchSingleCompany() {
    yield takeEveryWithErrorHandling(CompanyActionType.FetchSingle, fetchSingleCompany);
  },
  watchSaveSingleCompany,
  watchCreateSingleCompany,
];
