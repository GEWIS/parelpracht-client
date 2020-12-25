import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  Client, Company, CompanyParams, Dir2,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { setSummaries } from '../summaries/actionCreators';
import { summariesActionPattern, SummariesActionType } from '../summaries/actions';
import { SummaryCollections } from '../summaries/summaries';
import { fetchTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';
import {
  setSingle, errorSingle,
} from '../single/actionCreators';
import {
  singleActionPattern, SingleActionType, SingleCreateAction, SingleFetchAction, SingleSaveAction,
} from '../single/actions';
import { SingleEntities } from '../single/single';

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

export function* fetchCompanySummaries() {
  const client = new Client();
  const summaries = yield call([client, client.getCompanySummaries]);
  yield put(setSummaries(SummaryCollections.Companies, summaries));
}

function* fetchSingleCompany(action: SingleFetchAction<SingleEntities.Company>) {
  const client = new Client();
  const company = yield call([client, client.getCompany], action.id);
  yield put(setSingle(SingleEntities.Company, company));
}

function* saveSingleCompany(
  action: SingleSaveAction<SingleEntities.Company, CompanyParams>,
) {
  const client = new Client();
  yield call([client, client.updateCompany], action.id, action.data);
  const company = yield call([client, client.getCompany], action.id);
  yield put(setSingle(SingleEntities.Company, company));
}

function* errorSaveSingleCompany() {
  yield put(errorSingle(SingleEntities.Company));
}

function* watchSaveSingleCompany() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Company, SingleActionType.Save),
    saveSingleCompany,
    { onErrorSaga: errorSaveSingleCompany },
  );
}

function* createSingleCompany(
  action: SingleCreateAction<SingleEntities.Company, CompanyParams>,
) {
  const client = new Client();
  const company = yield call([client, client.createCompany], action.data);
  yield put(setSingle(SingleEntities.Company, company));
  yield put(fetchTable(Tables.Companies));
}

function* errorCreateSingleCompany() {
  yield put(errorSingle(SingleEntities.Company));
}

function* watchCreateSingleCompany() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Company, SingleActionType.Create),
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
  function* watchFetchCompanySummaries() {
    yield takeEveryWithErrorHandling(
      summariesActionPattern(
        SummaryCollections.Companies,
        SummariesActionType.Fetch,
      ),
      fetchCompanySummaries,
    );
  },
  function* watchFetchSingleCompany() {
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.Company, SingleActionType.Fetch),
      fetchSingleCompany,
    );
  },
  watchSaveSingleCompany,
  watchCreateSingleCompany,
];
