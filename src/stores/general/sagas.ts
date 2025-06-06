import { call, put } from 'redux-saga/effects';
import { Client, IGeneralPrivateInfo, IGeneralPublicInfo } from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { generalPrivateSetInfo, generalPublicSetInfo } from './actionCreators';
import { GeneralActionType } from './actions';

export function* fetchGeneralPrivateInfo() {
  const client = new Client();

  const generalPrivateInfo: IGeneralPrivateInfo = yield call([
    client, client.getPrivateGeneralInfo]);
  const { financialYears } = generalPrivateInfo;

  yield put(generalPrivateSetInfo(financialYears));
}

export function* fetchGeneralPublicInfo() {
  const client = new Client();

  const generalPublicInfo: IGeneralPublicInfo = yield call([
    client, client.getPublicGeneralInfo]);
  const { loginMethod, setupDone } = generalPublicInfo;

  yield put(generalPublicSetInfo(loginMethod, setupDone));
}

export default [
  function* watchFetchGeneralPublicInfo() {
    yield takeEveryWithErrorHandling(GeneralActionType.FetchPublicInfo, fetchGeneralPublicInfo);
  },
  function* watchFetchGeneralPrivateInfo() {
    yield takeEveryWithErrorHandling(GeneralActionType.FetchPrivateInfo, fetchGeneralPrivateInfo);
  },
];
