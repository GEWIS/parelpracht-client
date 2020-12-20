import { call, put, takeEvery } from 'redux-saga/effects';
import { Client } from '../../clients/server.generated';
import { setProducts, setSingleProduct, fetchProducts as createFetchProducts } from './actionCreators';
import {
  ProductActionType, ProductsCreateSingleAction, ProductsFetchSingleAction,
  ProductsSaveSingleAction,
} from './actions';

function* fetchProducts() {
  const client = new Client();
  const products = yield call([client, client.getProducts]);
  yield put(setProducts(products));
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

function* createSingleProduct(action: ProductsCreateSingleAction) {
  const client = new Client();
  const product = yield call([client, client.createProduct], action.product);
  yield put(setSingleProduct(product));
  yield put(createFetchProducts());
}

export default [
  function* watchFetchProducts() { yield takeEvery(ProductActionType.Fetch, fetchProducts); },
  function* watchFetchSingleProduct() {
    yield takeEvery(ProductActionType.FetchSingle, fetchSingleProduct);
  },
  function* watchSaveSingleProduct() {
    yield takeEvery(ProductActionType.SaveSingle, saveSingleProduct);
  },
  function* watchCreateSingleProduct() {
    yield takeEvery(ProductActionType.CreateSingle, createSingleProduct);
  },
];
