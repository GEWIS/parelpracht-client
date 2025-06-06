import { call, put } from 'redux-saga/effects';
import {
  AuthStatus, Client, LDAPLoginParams, LoginParams, ResetPasswordRequest, SetupParams, UserParams,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { fetchSummaries } from '../summaries/actionCreators';
import { SummaryCollections } from '../summaries/summaries';
import { generalPrivateFetchInfo, generalPublicFetchInfo } from '../general/actionCreators';
import {
  authFetchProfile, authFetchStatus, authRequestError,
  authRequestSuccess, authSetApiKey, authSetProfile, authSetStatus,
} from './actionCreators';
import {
  AuthActionType, AuthForgotPassword, AuthLoginLDAP, AuthLoginLocal, AuthResetPassword, AuthSetup,
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

    // Fetch the general data
    yield put(generalPrivateFetchInfo());
  }
}

function* fetchProfile() {
  const client = new Client();

  // @ts-ignore
  const profile = yield call([client, client.getProfile]);
  yield put(authSetProfile(profile));
}

function* loginLocal(action: AuthLoginLocal) {
  const client = new Client();

  yield call([client, client.login],
    new LoginParams({
      email: action.email,
      password: action.password,
      rememberMe: action.rememberMe,
    }));

  yield put(authFetchStatus());
}

function* loginLDAP(action: AuthLoginLDAP) {
  const client = new Client();

  yield call([client, client.loginLDAP],
    new LDAPLoginParams({
      username: action.username,
      password: action.password,
      rememberMe: action.rememberMe,
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

function* generateApiKey() {
  const client = new Client();

  const apiKey: string | undefined = yield call([client, client.generateApiKey]);

  yield put(authFetchProfile());
  yield put(authSetApiKey(apiKey));
}

function* getApiKey() {
  const client = new Client();

  const apiKey: string | undefined = yield call([client, client.getApiKey]);

  yield put(authFetchProfile());
  yield put(authSetApiKey(apiKey));
}

function* revokeApiKey() {
  const client = new Client();

  yield call([client, client.revokeApiKey]);

  yield put(authFetchProfile());
  yield put(authSetApiKey(undefined));
}

function* setup(action: AuthSetup) {
  const client = new Client();

  yield call([client, client.postSetup],
    new SetupParams(
      {
        admin: new UserParams({
          email: action.email,
          firstName: action.firstname,
          lastNamePreposition: action.preposition,
          lastName: action.lastname,
          gender: action.gender,
          password: action.password,
          rememberMe: action.rememberMe,
          function: '',
        }),
      }));
  yield put(generalPublicFetchInfo());
  yield put(authFetchStatus());
}

export default [
  function* watchFetchAuthStatus() {
    yield takeEveryWithErrorHandling(AuthActionType.FetchStatus, fetchAuthStatus);
  },
  function* watchFetchProfile() {
    yield takeEveryWithErrorHandling(AuthActionType.FetchProfile, fetchProfile);
  },
  function* watchLoginLocal() {
    yield takeEveryWithErrorHandling(AuthActionType.LoginLocal, loginLocal);
  },
  function* watchLoginLDAP() {
    yield takeEveryWithErrorHandling(AuthActionType.LoginLDAP, loginLDAP);
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

  function* watchGenerateApiKey() {
    yield takeEveryWithErrorHandling(AuthActionType.GenerateApiKey, generateApiKey);
  },
  function* watchGetApiKey() {
    yield takeEveryWithErrorHandling(AuthActionType.GetApiKey, getApiKey);
  },
  function* watchRevokeApiKey() {
    yield takeEveryWithErrorHandling(AuthActionType.RevokeApiKey, revokeApiKey);
  },
  function* watchSetup() {
    yield takeEveryWithErrorHandling(AuthActionType.Setup, setup);
  },
];
