import {
  call, put, select, takeEvery, throttle,
} from 'redux-saga/effects';
import { Client, Dir } from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import type { RootState } from '../store';
import {
  setProducts, setSingleProduct, fetchProducts as createFetchProducts, errorSingleProduct,
} from './actionCreators';
import {
  ProductActionType, ProductsCreateSingleAction, ProductsFetchSingleAction,
  ProductsSaveSingleAction,
} from './actions';

function* fetchProducts() {
  const client = new Client();

  const state: RootState = yield select();
  const {
    listSortColumn, listSortDirection,
    listTake, listSkip,
    listSearch,
  } = state.product;

  const { list, count } = yield call(
    [client, client.getAllProducts], listSortColumn, listSortDirection as Dir,
    listSkip, listTake, listSearch,
  );
  yield put(setProducts(list, count));
}

function* fetchSingleProduct(action: ProductsFetchSingleAction) {
  const client = new Client();
  const product = yield call([client, client.getProduct], action.id);
  yield put(setSingleProduct(product));
}

function* saveSingleProduct(action: ProductsSaveSingleAction) {
  const client = new Client();
  yield call([client, client.updateProduct], action.id, action.product);
  const product = yield call([client, client.getProduct], action.id);
  yield put(setSingleProduct(product));
}

function* errorSaveSingleProduct() {
  yield put(errorSingleProduct());
}

function* watchSaveSingleProduct() {
  yield takeEveryWithErrorHandling(
    ProductActionType.SaveSingle,
    saveSingleProduct,
    { onErrorSaga: errorSaveSingleProduct },
  );
}

function* createSingleProduct(action: ProductsCreateSingleAction) {
  const client = new Client();
  const product = yield call([client, client.createProduct], action.product);
  yield put(setSingleProduct(product));
  yield put(createFetchProducts());
}

function* errorCreateSingleProduct() {
  yield put(errorSingleProduct());
}

function* watchCreateSingleProduct() {
  yield takeEveryWithErrorHandling(
    ProductActionType.CreateSingle,
    createSingleProduct,
    { onErrorSaga: errorCreateSingleProduct },
  );
}

export default [
  function* watchFetchProducts() {
    yield throttle(500, ProductActionType.Fetch, fetchProducts);
  },
  function* watchFetchSingleProduct() {
    yield takeEveryWithErrorHandling(ProductActionType.FetchSingle, fetchSingleProduct);
  },
  watchSaveSingleProduct,
  watchCreateSingleProduct,
];
