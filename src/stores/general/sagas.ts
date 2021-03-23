import { call, put } from 'redux-saga/effects';
import { Client } from '../../clients/server.generated';
import { generalSetInfo } from './actionCreators';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { GeneralActionType } from './actions';

export function* fetchGeneralInfo() {
  const client = new Client();

  const financialYears = yield call([client, client.getGeneralInfo]);

  yield put(generalSetInfo(financialYears));
}

export default [
  function* watchFetchGeneralInfo() {
    yield takeEveryWithErrorHandling(GeneralActionType.FetchInfo, fetchGeneralInfo);
  },
];
