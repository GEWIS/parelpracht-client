import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  Client, Dir, Product, ProductParams,
} from '../../clients/server.generated';
import { fetchCompanySummaries } from '../company/sagas';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { errorSingle, setSingle } from '../single/actionCreators';
import {
  singleActionPattern, SingleActionType, SingleCreateAction, SingleFetchAction, SingleSaveAction,
} from '../single/actions';
import { SingleEntities } from '../single/single';
import { setSummaries } from '../summaries/actionCreators';
import { summariesActionPattern, SummariesActionType } from '../summaries/actions';
import { SummaryCollections } from '../summaries/summaries';
import { fetchTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';

function* fetchProducts() {
  const client = new Client();

  const state: TableState<Product> = yield select(getTable, Tables.Products);
  const {
    sortColumn, sortDirection,
    take, skip,
    search,
  } = state;

  const { list, count } = yield call(
    [client, client.getAllProducts], sortColumn, sortDirection as Dir,
    skip, take, search,
  );
  yield put(setTable(Tables.Products, list, count));
}

export function* fetchProductSummaries() {
  const client = new Client();
  const summaries = yield call([client, client.getProductSummaries]);
  yield put(setSummaries(SummaryCollections.Products, summaries));
}

function* fetchSingleProduct(action: SingleFetchAction<SingleEntities.Product>) {
  const client = new Client();
  const product = yield call([client, client.getProduct], action.id);
  yield put(setSingle(SingleEntities.Product, product));
}

function* saveSingleProduct(
  action: SingleSaveAction<SingleEntities.Product, ProductParams>,
) {
  const client = new Client();
  yield call([client, client.updateProduct], action.id, action.data);
  const product = yield call([client, client.getProduct], action.id);
  yield put(setSingle(SingleEntities.Product, product));
}

function* errorSaveSingleProduct() {
  yield put(errorSingle(SingleEntities.Product));
}

function* watchSaveSingleProduct() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Product, SingleActionType.Save),
    saveSingleProduct,
    { onErrorSaga: errorSaveSingleProduct },
  );
}

function* createSingleProduct(
  action: SingleCreateAction<SingleEntities.Product, ProductParams>,
) {
  const client = new Client();
  const product = yield call([client, client.createProduct], action.data);
  yield put(setSingle(SingleEntities.Product, product));
  yield put(fetchTable(Tables.Products));
}

function* errorCreateSingleProduct() {
  yield put(errorSingle(SingleEntities.Product));
}

function* watchCreateSingleProduct() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Product, SingleActionType.Create),
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
  function* watchFetchProductSummaries() {
    yield takeEveryWithErrorHandling(
      summariesActionPattern(
        SummaryCollections.Products,
        SummariesActionType.Fetch,
      ),
      fetchProductSummaries,
    );
  },
  function* watchFetchSingleProduct() {
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.Product, SingleActionType.Fetch),
      fetchSingleProduct,
    );
  },
  watchSaveSingleProduct,
  watchCreateSingleProduct,
];
