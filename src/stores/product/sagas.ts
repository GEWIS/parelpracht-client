import { call, put, takeEvery } from 'redux-saga/effects';
import { Client } from '../../clients/server.generated';
import { setProducts, setSingleProduct } from './actionCreators';
import { ProductActionType, ProductsFetchSingleAction } from './actions';

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

export default [
  function* watchFetchProducts() { yield takeEvery(ProductActionType.Fetch, fetchProducts); },
  function* watchFetchSingleProduct() {
    yield takeEvery(ProductActionType.FetchSingle, fetchSingleProduct);
  },
];
