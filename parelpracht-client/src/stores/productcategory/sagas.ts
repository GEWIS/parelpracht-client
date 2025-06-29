import { call, put, select, throttle } from 'redux-saga/effects';
import {
  ApiException,
  CategoryListResponse,
  CategoryParams,
  CategorySummary,
  Client,
  ListOrFilter,
  ListParams,
  ListSorting,
  ProductCategory,
  SortDirection,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { clearSingle, errorSingle, notFoundSingle, setSingle } from '../single/actionCreators';
import {
  singleActionPattern,
  SingleActionType,
  SingleCreateAction,
  SingleDeleteAction,
  SingleFetchAction,
  SingleSaveAction,
} from '../single/actions';
import { SingleEntities } from '../single/single';
import { addSummary, deleteSummary, setSummaries, updateSummary } from '../summaries/actionCreators';
import { summariesActionPattern, SummariesActionType } from '../summaries/actions';
import { SummaryCollections } from '../summaries/summaries';
import { fetchTable, prevPageTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';

function toSummary(category: ProductCategory): CategorySummary {
  return new CategorySummary({
    id: category.id,
    name: category.name,
  });
}

function* fetchProductCategories() {
  const client = new Client();

  const state: TableState<ProductCategory> = yield select(getTable, Tables.ProductCategories);
  const { sortColumn, sortDirection, take, skip, search, filters } = state;

  let { list, count } = yield call(
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

  if (list.length === 0 && count > 0) {
    yield put(prevPageTable(Tables.ProductCategories));

    const res: CategoryListResponse = yield call(
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
    list = res.list;
    count = res.count;
  }

  yield put(setTable(Tables.ProductCategories, list, count, {}));
}

export function* fetchProductCategorySummaries() {
  const client = new Client();
  const summaries: CategorySummary[] = yield call([client, client.getCategorySummaries]);
  yield put(setSummaries(SummaryCollections.ProductCategories, summaries));
}

function* fetchSingleProductCategory(action: SingleFetchAction<SingleEntities.ProductCategory>) {
  const client = new Client();
  const productCategory: ProductCategory = yield call([client, client.getCategory], action.id);
  yield put(setSingle(SingleEntities.ProductCategory, productCategory));
  yield put(updateSummary(SummaryCollections.ProductCategories, toSummary(productCategory)));
}

function* errorFetchSingleProductCategory(error: ApiException) {
  if (error.status === 404) {
    yield put(notFoundSingle(SingleEntities.ProductCategory));
  } else {
    yield put(errorSingle(SingleEntities.ProductCategory));
  }
}

function* saveSingleProductCategory(action: SingleSaveAction<SingleEntities.ProductCategory, CategoryParams>) {
  const client = new Client();
  yield call([client, client.updateCategory], action.id, action.data);
  const productCategory: ProductCategory = yield call([client, client.getCategory], action.id);
  yield put(setSingle(SingleEntities.ProductCategory, productCategory));
  yield put(fetchTable(Tables.ProductCategories));
  yield put(updateSummary(SummaryCollections.ProductCategories, toSummary(productCategory)));
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

function* createSingleProductCategory(action: SingleCreateAction<SingleEntities.ProductCategory, CategoryParams>) {
  const client = new Client();
  const productCategory: ProductCategory = yield call([client, client.createCategory], action.data);
  yield put(setSingle(SingleEntities.ProductCategory, productCategory));
  yield put(fetchTable(Tables.ProductCategories));
  yield put(addSummary(SummaryCollections.ProductCategories, toSummary(productCategory)));
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
  yield put(deleteSummary(SummaryCollections.ProductCategories, action.id));
}

function* errorDeleteSingleProductCategory() {
  yield put(errorSingle(SingleEntities.ProductCategory));
}

function* watchDeleteSingleProductCategory() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.ProductCategory, SingleActionType.Delete),
    deleteSingleProductCategory,
    { onErrorSaga: errorDeleteSingleProductCategory },
  );
}

export default [
  function* watchFetchProductCategories() {
    yield throttle(500, tableActionPattern(Tables.ProductCategories, TableActionType.Fetch), fetchProductCategories);
  },
  function* watchFetchProductCategorySummaries() {
    yield takeEveryWithErrorHandling(
      summariesActionPattern(SummaryCollections.ProductCategories, SummariesActionType.Fetch),
      fetchProductCategorySummaries,
    );
  },
  function* watchFetchSingleProductCategory() {
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.ProductCategory, SingleActionType.Fetch),
      fetchSingleProductCategory,
      { onErrorSaga: errorFetchSingleProductCategory },
    );
  },
  watchSaveSingleProductCategory,
  watchCreateSingleProductCategory,
  watchDeleteSingleProductCategory,
];
