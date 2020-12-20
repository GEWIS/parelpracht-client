import { Action } from 'redux';
import {
  ActionPattern, put, takeEvery,
} from 'redux-saga/effects';
import { showTransientAlert } from './alerts/actionCreators';

export function takeEveryWithErrorHandling<A extends Action>(
  pattern: ActionPattern<A>,
  saga: (action: A) => any,
  options?: {
    silent?: boolean,
    onErrorSaga?: (error: Error, action: A) => any
  },
) {
  return takeEvery(pattern, function* errorSaga(action: A) {
    try {
      yield* saga(action);
    } catch (err) {
      if (!options?.silent) {
        const message = err.error?.message || err.message;
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
