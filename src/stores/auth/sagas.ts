import { call, put } from 'redux-saga/effects';
import {
  AuthStatus, Client, LoginParams, ResetPasswordRequest,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { fetchSummaries } from '../summaries/actionCreators';
import { SummaryCollections } from '../summaries/summaries';
import {
  authFetchProfile, authFetchStatus, authRequestError,
  authRequestSuccess, authSetProfile, authSetStatus,
} from './actionCreators';
import {
  AuthActionType, AuthForgotPassword, AuthLogin, AuthResetPassword,
} from './actions';

export function* fetchAuthStatus() {
  const client = new Client();

  const status: AuthStatus = yield call([client, client.getAuthStatus]);
  yield put(authSetStatus(status));

  if (status.authenticated) {
    // We can now fetch the profile of the user
    yield put(authFetchProfile());

    // Fetch the summaries
    const summaries = Object.values(SummaryCollections);
    for (let i = 0; i < summaries.length; i++) {
      yield put(fetchSummaries(summaries[i]));
    }
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

function* forgotPassword(action: AuthForgotPassword) {
  const client = new Client();

  yield call([client, client.forgotPassword], action.email);

  yield put(authRequestSuccess());
}

function* resetPassword(action: AuthResetPassword) {
  const client = new Client();

  yield call([client, client.resetPassword], new ResetPasswordRequest({
    password: action.password, repeatPassword: action.passwordRepeat, token: action.token,
  }));

  yield put(authRequestSuccess());
}

function* errorResetPassword() {
  yield put(authRequestError());
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

  function* watchForgotPassword() {
    yield takeEveryWithErrorHandling(AuthActionType.ForgotPassword, forgotPassword);
  },
  function* watchResetPassword() {
    yield takeEveryWithErrorHandling(
      AuthActionType.ResetPassword, resetPassword,
      { onErrorSaga: errorResetPassword },
    );
  },
];
