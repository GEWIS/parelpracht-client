import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  Client,
  ListOrFilter,
  ListParams,
  ListSorting,
  SortDirection,
  User,
  UserParams,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { clearSingle, errorSingle, setSingle } from '../single/actionCreators';
import {
  singleActionPattern,
  SingleActionType,
  SingleCreateAction,
  SingleDeleteAction,
  SingleFetchAction,
  SingleSaveAction,
} from '../single/actions';
import { getSingle } from '../single/selectors';
import { SingleEntities } from '../single/single';
import { fetchSummaries, setSummaries } from '../summaries/actionCreators';
import { summariesActionPattern, SummariesActionType } from '../summaries/actions';
import { SummaryCollections } from '../summaries/summaries';
import { fetchTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';

function* fetchUsers() {
  const client = new Client();

  const state: TableState<User> = yield select(getTable, Tables.Users);
  const {
    sortColumn, sortDirection,
    take, skip,
    search, filters,
  } = state;

  const { list, count } = yield call(
    [client, client.getAllUsers],
    new ListParams({
      sorting: new ListSorting({
        column: sortColumn,
        direction: sortDirection as SortDirection,
      }),
      filters: filters.map((f) => new ListOrFilter(f)),
      skip,
      take,
      search,
    }),
  );
  yield put(setTable(Tables.Users, list, count, {}));
}

export function* fetchUserSummaries() {
  const client = new Client();
  const summaries = yield call([client, client.getUserSummaries]);
  yield put(setSummaries(SummaryCollections.Users, summaries));
}

function* fetchSingleUser(action: SingleFetchAction<SingleEntities.User>) {
  const client = new Client();
  const user = yield call([client, client.getUser], action.id);
  yield put(setSingle(SingleEntities.User, user));
}

function* deleteSingleUser(action: SingleDeleteAction<SingleEntities.User>) {
  const client = new Client();
  yield call([client, client.deleteUser], action.id);
  yield put(clearSingle(SingleEntities.User));
  yield put(fetchSummaries(SummaryCollections.Users));
}

function* errorDeleteSingleUser() {
  const user = yield select(getSingle, SingleEntities.User);
  yield put(setSingle(SingleEntities.User, user.data));
}

function* saveSingleUser(
  action: SingleSaveAction<SingleEntities.User, UserParams>,
) {
  const client = new Client();
  yield call([client, client.updateUser], action.id, action.data);
  const user = yield call([client, client.getUser], action.id);
  yield put(setSingle(SingleEntities.User, user));
  yield put(fetchSummaries(SummaryCollections.Users));
}

function* errorSaveSingleUser() {
  yield put(errorSingle(SingleEntities.User));
}

function* watchSaveSingleUser() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.User, SingleActionType.Save),
    saveSingleUser,
    { onErrorSaga: errorSaveSingleUser },
  );
}

function* createSingleUser(
  action: SingleCreateAction<SingleEntities.User, UserParams>,
) {
  const client = new Client();
  const user = yield call([client, client.createUser], action.data);
  yield put(setSingle(SingleEntities.User, user));
  yield put(fetchTable(Tables.Users));
  yield put(fetchSummaries(SummaryCollections.Users));
}

function* errorCreateSingleUser() {
  yield put(errorSingle(SingleEntities.User));
}

function* watchCreateSingleUser() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.User, SingleActionType.Create),
    createSingleUser,
    { onErrorSaga: errorCreateSingleUser },
  );
}

export default [
  function* watchFetchUsers() {
    yield throttle(
      500,
      tableActionPattern(Tables.Users, TableActionType.Fetch),
      fetchUsers,
    );
  },
  function* watchFetchUserSummaries() {
    yield takeEveryWithErrorHandling(
      summariesActionPattern(
        SummaryCollections.Users,
        SummariesActionType.Fetch,
      ),
      fetchUserSummaries,
    );
  },
  function* watchDeleteSingleUser() {
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.User, SingleActionType.Delete),
      deleteSingleUser,
      { onErrorSaga: errorDeleteSingleUser },
    );
  },
  function* watchFetchSingleUser() {
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.User, SingleActionType.Fetch),
      fetchSingleUser,
    );
  },
  watchSaveSingleUser,
  watchCreateSingleUser,
];
