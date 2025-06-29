import { Action } from 'redux';
import { ActionPattern, put, takeEvery } from 'redux-saga/effects';
import { ApiError, ApiException } from '../clients/server.generated';
import { showTransientAlert } from './alerts/actionCreators';

function errorToString(err?: ApiError) {
  if (err && err.statusCode && err.message) return `${err.statusCode}: ${err.message}`;
  return undefined;
}

export function takeEveryWithErrorHandling<A extends Action>(
  pattern: ActionPattern<A>,
  saga: (action: A) => any,
  options?: {
    silent?: boolean;
    onErrorSaga?: (error: ApiException, action: A) => any;
  },
) {
  return takeEvery(pattern, function* errorSaga(action: A) {
    try {
      yield* saga(action);
    } catch (err: any) {
      let apiError: ApiError | undefined;

      try {
        apiError = JSON.parse(err.response).error;
      } catch (e) {
        apiError = undefined;
      }

      if (!options?.silent) {
        const message = errorToString(apiError) || err.error?.message || err.message;
        yield put(
          showTransientAlert({
            message,
            title: 'Error',
            type: 'error',
          }),
        );
      }

      if (options?.onErrorSaga) {
        yield* options.onErrorSaga(err, action);
      }
    }
  });
}
