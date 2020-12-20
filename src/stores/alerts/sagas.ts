import { delay, put, takeEvery } from 'redux-saga/effects';
import { hideAlert, showAlert } from './actionCreators';
import { ActionTypeNames, ShowTransientAlertAction } from './actions';

function* showTransientAlert(action: ShowTransientAlertAction) {
  const showAlertAction = showAlert(action.alert);
  yield put(showAlertAction);
  const delayTime = typeof action.alert.displayTimeInMs !== 'undefined'
    ? action.alert.displayTimeInMs : 10000;
  yield delay(delayTime);
  yield put(hideAlert(showAlertAction.alert.id));
}

function* watchShowTransientAlert() {
  yield takeEvery(ActionTypeNames.ShowTransientAlert, showTransientAlert);
}

export default [watchShowTransientAlert];
