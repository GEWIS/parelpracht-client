import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import { Client, Dir5, Contact } from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { setSummaries } from '../summaries/actionCreators';
import { summariesActionPattern, SummariesActionType } from '../summaries/actions';
import { SummaryCollections } from '../summaries/summaries';
import { setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';

function* fetchContacts() {
  const client = new Client();

  const state: TableState<Contact> = yield select(getTable, Tables.Contacts);
  const {
    sortColumn, sortDirection,
    take, skip,
    search,
  } = state;

  const { list, count } = yield call(
    [client, client.getAllContacts], sortColumn, sortDirection as Dir5,
    skip, take, search,
  );
  yield put(setTable(Tables.Contacts, list, count));
}

export function* fetchContactSummaries() {
  const client = new Client();
  const summaries = yield call([client, client.getContactSummaries]);
  yield put(setSummaries(SummaryCollections.Contacts, summaries));
}

export default [
  function* watchFetchContacts() {
    yield throttle(
      500,
      tableActionPattern(Tables.Contacts, TableActionType.Fetch),
      fetchContacts,
    );
  },
  function* watchFetchContactSummaries() {
    yield takeEveryWithErrorHandling(
      summariesActionPattern(
        SummaryCollections.Contracts,
        SummariesActionType.Fetch,
      ),
      fetchContactSummaries,
    );
  },
];
