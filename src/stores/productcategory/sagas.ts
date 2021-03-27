import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  CategoryParams,
  Client,
  ListOrFilter,
  ListParams,
  ListSorting,
  ProductCategory,
  SortDirection,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { clearSingle, errorSingle, setSingle } from '../single/actionCreators';
import {
  singleActionPattern,
  SingleActionType,
  SingleCreateAction,
  SingleDeleteAction,
  SingleFetchAction,
  SingleSaveAction,
} from '../single/actions';
import { SingleEntities } from '../single/single';
import { fetchSummaries, setSummaries } from '../summaries/actionCreators';
import { summariesActionPattern, SummariesActionType } from '../summaries/actions';
import { SummaryCollections } from '../summaries/summaries';
import { fetchTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';

function* fetchProductCategories() {
  const client = new Client();

  const state: TableState<ProductCategory> = yield select(getTable, Tables.ProductCategories);
  const {
    sortColumn, sortDirection,
    take, skip,
    search, filters,
  } = state;

  const { list, count } = yield call(
    [client, client.getAllCategories],
    new ListParams({
      sorting: new ListSorting({
        column: sortColumn,
        direction: sortDirection as SortDirection,
      }),
      filters: filters.map((f) => new ListOrFilter(f)),
      skip,
      take,
      search,
    }),
  );
  yield put(setTable(Tables.ProductCategories, list, count, {}));
}

export function* fetchProductCategorySummaries() {
  const client = new Client();
  const summaries = yield call([client, client.getCategorySummaries]);
  yield put(setSummaries(SummaryCollections.ProductCategories, summaries));
}

function* fetchSingleProductCategory(action: SingleFetchAction<SingleEntities.ProductCategory>) {
  const client = new Client();
  const productCategory = yield call([client, client.getCategory], action.id);
  yield put(setSingle(SingleEntities.ProductCategory, productCategory));
}

function* saveSingleProductCategory(
  action: SingleSaveAction<SingleEntities.ProductCategory, CategoryParams>,
) {
  const client = new Client();
  yield call([client, client.updateCategory], action.id, action.data);
  const productCategory = yield call([client, client.getCategory], action.id);
  yield put(setSingle(SingleEntities.ProductCategory, productCategory));
  yield put(fetchTable(Tables.ProductCategories));
  yield put(fetchSummaries(SummaryCollections.ProductCategories));
}

function* errorSaveSingleProductCategory() {
  yield put(errorSingle(SingleEntities.ProductCategory));
}

function* watchSaveSingleProductCategory() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.ProductCategory, SingleActionType.Save),
    saveSingleProductCategory,
    { onErrorSaga: errorSaveSingleProductCategory },
  );
}

function* createSingleProductCategory(
  action: SingleCreateAction<SingleEntities.ProductCategory, CategoryParams>,
) {
  const client = new Client();
  const productcategory = yield call([client, client.createCategory], action.data);
  yield put(setSingle(SingleEntities.ProductCategory, productcategory));
  yield put(fetchTable(Tables.ProductCategories));
  yield put(fetchSummaries(SummaryCollections.ProductCategories));
}

function* errorCreateSingleProductCategory() {
  yield put(errorSingle(SingleEntities.ProductCategory));
}

function* watchCreateSingleProductCategory() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.ProductCategory, SingleActionType.Create),
    createSingleProductCategory,
    { onErrorSaga: errorCreateSingleProductCategory },
  );
}

function* deleteSingleProductCategory(action: SingleDeleteAction<SingleEntities.ProductCategory>) {
  const client = new Client();
  yield call([client, client.deleteCategory], action.id);
  yield put(clearSingle(SingleEntities.ProductCategory));
  yield put(fetchTable(Tables.ProductCategories));
  yield put(fetchSummaries(SummaryCollections.ProductCategories));
}

function* errorDeleteSingleProductCategory() {
  yield put(errorSingle(SingleEntities.ProductCategory));
}

function* watchDeleteSingleProductCategory() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.ProductCategory, SingleActionType.Delete),
    deleteSingleProductCategory, { onErrorSaga: errorDeleteSingleProductCategory },
  );
}

export default [
  function* watchFetchProductCategories() {
    yield throttle(
      500,
      tableActionPattern(Tables.ProductCategories, TableActionType.Fetch),
      fetchProductCategories,
    );
  },
  function* watchFetchProductCategorySummaries() {
    yield takeEveryWithErrorHandling(
      summariesActionPattern(
        SummaryCollections.ProductCategories,
        SummariesActionType.Fetch,
      ),
      fetchProductCategorySummaries,
    );
  },
  function* watchFetchSingleProductCategory() {
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.ProductCategory, SingleActionType.Fetch),
      fetchSingleProductCategory,
    );
  },
  watchSaveSingleProductCategory,
  watchCreateSingleProductCategory,
  watchDeleteSingleProductCategory,
];
