import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import { Client, Dir, Product } from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { fetchTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';
import {
  /* setProducts,  */
  setSingleProduct, /* fetchProducts as createFetchProducts, */
  errorSingleProduct,
} from './actionCreators';
import {
  ProductActionType, ProductsCreateSingleAction, ProductsFetchSingleAction,
  ProductsSaveSingleAction,
} from './actions';

function* fetchProducts() {
  const client = new Client();

  const state: TableState<Product> = yield select(getTable, Tables.Products);
  const {
    sortColumn, sortDirection,
    take, skip,
    search,
  } = state;

  const { list, count } = yield call(
    [client, client.getProducts], sortColumn, sortDirection as Dir,
    skip, take, search,
  );
  yield put(setTable(Tables.Products, list, count));
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
  yield put(fetchTable(Tables.Products));
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
    yield throttle(
      500,
      tableActionPattern(Tables.Products, TableActionType.Fetch),
      fetchProducts,
    );
  },
  function* watchFetchSingleProduct() {
    yield takeEveryWithErrorHandling(ProductActionType.FetchSingle, fetchSingleProduct);
  },
  watchSaveSingleProduct,
  watchCreateSingleProduct,
];
