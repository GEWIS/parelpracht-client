import { call, put } from 'redux-saga/effects';
import { AuthStatus, Client, LoginParams } from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { fetchSummaries } from '../summaries/actionCreators';
import { SummaryCollections } from '../summaries/summaries';
import {
  authFetchProfile, authFetchStatus, authSetProfile, authSetStatus,
} from './actionCreators';
import { AuthActionType, AuthLogin } from './actions';

export function* fetchAuthStatus() {
  const client = new Client();

  const status: AuthStatus = yield call([client, client.getAuthStatus]);
  yield put(authSetStatus(status));

  if (status.authenticated) {
    // We can now fetch the profile of the user
    yield put(authFetchProfile());

    // Fetch the summaries
    yield put(fetchSummaries(SummaryCollections.Companies));
    yield put(fetchSummaries(SummaryCollections.Contacts));
  }
}

function* fetchProfile() {
  const client = new Client();

  const profile = yield call([client, client.getProfile]);
  yield put(authSetProfile(profile));
}

function* login(action: AuthLogin) {
  const client = new Client();

  yield call([client, client.login],
    new LoginParams({
      email: action.email,
      password: action.password,
    }));

  yield put(authFetchStatus());
}

function* logout() {
  const client = new Client();

  yield call([client, client.logout]);

  yield put(authFetchStatus());
}

export default [
  function* watchFetchAuthStatus() {
    yield takeEveryWithErrorHandling(AuthActionType.FetchStatus, fetchAuthStatus);
  },
  function* watchFetchProfile() {
    yield takeEveryWithErrorHandling(AuthActionType.FetchProfile, fetchProfile);
  },
  function* watchLogin() {
    yield takeEveryWithErrorHandling(AuthActionType.Login, login);
  },
  function* watchLogout() {
    yield takeEveryWithErrorHandling(AuthActionType.Logout, logout);
  },
];
