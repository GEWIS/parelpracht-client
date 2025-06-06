import { call, put } from 'redux-saga/effects';
import { SingleEntities } from '../single/single';
import {
  ActivityParams,
  Client, ProductInstance,
  ProductInstanceParams,
  ProductInstanceStatusParams,
} from '../../clients/server.generated';
import { errorSingle, fetchSingle } from '../single/actionCreators';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { singleActionPattern, SingleActionType } from '../single/actions';
import {
  SingleCreateInstanceAction,
  SingleCreateInstanceCommentAction,
  SingleCreateInstanceStatusAction,
  SingleDeleteInstanceAction,
  SingleDeleteInstanceActivityAction,
  SingleSaveInstanceAction,
  SingleSaveInstanceActivityAction,
} from './actions';

function* errorProductInstance() {
  yield put(errorSingle(SingleEntities.ProductInstance));
}

function* saveSingleProductInstance(
  action: SingleSaveInstanceAction<ProductInstanceParams>,
) {
  const client = new Client();
  yield call([client, client.updateProductInstanceOnContract], action.id,
    action.instanceId, action.data);
  yield put(fetchSingle(SingleEntities.Contract, action.id));
}

function* watchSaveSingleProductInstance() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.ProductInstance, SingleActionType.Save),
    saveSingleProductInstance,
    { onErrorSaga: errorProductInstance },
  );
}

function* createSingleProductInstance(
  action: SingleCreateInstanceAction<ProductInstanceParams>,
) {
  const client = new Client();
  const instance: ProductInstance = yield call([client, client.addProductInstanceToContract],
    action.id, action.data);
  yield put(fetchSingle(SingleEntities.Contract, instance.contractId));
}

function* watchCreateSingleProductInstance() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.ProductInstance, SingleActionType.Create),
    createSingleProductInstance,
    { onErrorSaga: errorProductInstance },
  );
}

function* deleteSingleProductInstance(
  action: SingleDeleteInstanceAction,
) {
  const client = new Client();
  yield call([client, client.deleteProductInstance], action.id, action.instanceId);
  yield put(fetchSingle(SingleEntities.Contract, action.id));
}

function* watchDeleteSingleProductInstance() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.ProductInstance, SingleActionType.Delete),
    deleteSingleProductInstance,
    { onErrorSaga: errorProductInstance },
  );
}

function* createSingleProductInstanceStatus(
  action: SingleCreateInstanceStatusAction<ProductInstanceStatusParams>,
) {
  const client = new Client();
  yield call([client, client.addProductInstanceStatusToContract], action.id,
    action.instanceId, action.data);
  yield put(fetchSingle(SingleEntities.Contract, action.id));
}

function* watchCreateSingleProductInstanceStatus() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.ProductInstance, SingleActionType.CreateStatus),
    createSingleProductInstanceStatus,
    { onErrorSaga: errorProductInstance },
  );
}

function* createSingleProductInstanceComment(
  action: SingleCreateInstanceCommentAction<ActivityParams>,
) {
  const client = new Client();
  yield call([client, client.addProductInstanceCommentToContract], action.id,
    action.instanceId, action.data);
  yield put(fetchSingle(SingleEntities.Contract, action.id));
}

function* watchCreateSingleProductInstanceComment() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.ProductInstance, SingleActionType.CreateComment),
    createSingleProductInstanceComment,
    { onErrorSaga: errorProductInstance },
  );
}

function* saveSingleProductInstanceActivity(
  action: SingleSaveInstanceActivityAction<ActivityParams>,
) {
  const client = new Client();
  yield call([client, client.updateProductInstanceActivityOnContract],
    action.id, action.instanceId, action.activityId, action.data);
  yield put(fetchSingle(SingleEntities.Contract, action.id));
}

function* watchSaveSingleProductInstanceActivity() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.ProductInstance, SingleActionType.SaveActivity),
    saveSingleProductInstanceActivity,
    { onErrorSaga: errorProductInstance },
  );
}

function* deleteSingleProductInstanceActivity(
  action: SingleDeleteInstanceActivityAction,
) {
  const client = new Client();
  yield call([client, client.deleteProductInstanceActivityFromContract],
    action.id, action.instanceId, action.activityId);
  yield put(fetchSingle(SingleEntities.Contract, action.id));
}

function* watchDeleteSingleProductInstanceActivity() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.ProductInstance, SingleActionType.DeleteActivity),
    deleteSingleProductInstanceActivity,
    { onErrorSaga: errorProductInstance },
  );
}

export default [
  watchSaveSingleProductInstance,
  watchCreateSingleProductInstance,
  watchDeleteSingleProductInstance,
  watchCreateSingleProductInstanceStatus,
  watchCreateSingleProductInstanceComment,
  watchSaveSingleProductInstanceActivity,
  watchDeleteSingleProductInstanceActivity,
];
