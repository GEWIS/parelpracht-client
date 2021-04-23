import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  ActivityParams,
  Client,
  ListOrFilter,
  ListParams,
  ListSorting,
  Partial_FileParams,
  Product, ProductListResponse,
  ProductParams,
  ProductSummary,
  SortDirection,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { clearSingle, errorSingle, setSingle } from '../single/actionCreators';
import {
  singleActionPattern,
  SingleActionType,
  SingleCreateAction,
  SingleCreateCommentAction,
  SingleDeleteAction,
  SingleDeleteActivityAction,
  SingleDeleteFileAction,
  SingleFetchAction,
  SingleSaveAction,
  SingleSaveActivityAction,
  SingleSaveFileAction,
} from '../single/actions';
import { SingleEntities } from '../single/single';
import {
  addSummary, deleteSummary, setSummaries, updateSummary,
} from '../summaries/actionCreators';
import { summariesActionPattern, SummariesActionType } from '../summaries/actions';
import { SummaryCollections } from '../summaries/summaries';
import { fetchTable, prevPageTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';

function toSummary(product: Product): ProductSummary {
  return {
    id: product.id,
    nameDutch: product.nameDutch,
    nameEnglish: product.nameEnglish,
    targetPrice: product.targetPrice,
  } as ProductSummary;
}

function* fetchProducts() {
  const client = new Client();

  const state: TableState<Product> = yield select(getTable, Tables.Products);
  const {
    sortColumn, sortDirection,
    take, skip,
    search, filters,
  } = state;

  let { list, count } = yield call(
    [client, client.getAllProducts],
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
    yield put(prevPageTable(Tables.Products));

    const res: ProductListResponse = yield call(
      [client, client.getAllProducts],
      new ListParams({
        sorting: new ListSorting({
          column: sortColumn,
          direction: sortDirection as SortDirection,
        }),
        filters: filters.map((f) => new ListOrFilter(f)),
        skip: skip - take,
        take,
        search,
      }),
    );
    list = res.list;
    count = res.count;
  }

  yield put(setTable(Tables.Products, list, count, {}));
}

export function* fetchProductSummaries() {
  const client = new Client();
  const summaries: ProductSummary[] = yield call([client, client.getProductSummaries]);
  yield put(setSummaries(SummaryCollections.Products, summaries));
}

function* fetchSingleProduct(action: SingleFetchAction<SingleEntities.Product>) {
  const client = new Client();
  const product: Product = yield call([client, client.getProduct], action.id);
  yield put(setSingle(SingleEntities.Product, product));
  yield put(updateSummary(SummaryCollections.Products, toSummary(product)));
}

function* saveSingleProduct(
  action: SingleSaveAction<SingleEntities.Product, ProductParams>,
) {
  const client = new Client();
  yield call([client, client.updateProduct], action.id, action.data);
  const product: Product = yield call([client, client.getProduct], action.id);
  yield put(setSingle(SingleEntities.Product, product));
  yield put(updateSummary(SummaryCollections.Products, toSummary(product)));
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
  const product: Product = yield call([client, client.createProduct], action.data);
  yield put(setSingle(SingleEntities.Product, product));
  yield put(fetchTable(Tables.Products));
  yield put(addSummary(SummaryCollections.Products, toSummary(product)));
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

function* deleteSingleProduct(action: SingleDeleteAction<SingleEntities.Product>) {
  const client = new Client();
  yield call([client, client.deleteProduct], action.id);
  yield put(clearSingle(SingleEntities.Product));
  yield put(deleteSummary(SummaryCollections.Products, action.id));
}

function* errorDeleteSingleProduct() {
  yield put(errorSingle(SingleEntities.Product));
}

function* watchDeleteSingleProduct() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Product, SingleActionType.Delete),
    deleteSingleProduct, { onErrorSaga: errorDeleteSingleProduct },
  );
}

function* saveSingleProductFile(
  action: SingleSaveFileAction<SingleEntities.Product, Partial_FileParams>,
) {
  const client = new Client();
  yield call([client, client.updateProductFile], action.id, action.fileId, action.data);
  const product: Product = yield call([client, client.getProduct], action.id);
  yield put(setSingle(SingleEntities.Product, product));
}

function* errorSaveSingleProductFile() {
  yield put(errorSingle(SingleEntities.Product));
}

function* watchSaveSingleProductFile() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Product, SingleActionType.SaveFile),
    saveSingleProductFile, { onErrorSaga: errorSaveSingleProductFile },
  );
}

function* deleteSingleProductFile(action: SingleDeleteFileAction<SingleEntities.Product>) {
  const client = new Client();
  yield call([client, client.deleteProductFile], action.id, action.fileId);
  const product: Product = yield call([client, client.getProduct], action.id);
  yield put(setSingle(SingleEntities.Product, product));
}

function* errorDeleteSingleProductFile() {
  yield put(errorSingle(SingleEntities.Product));
}

function* watchDeleteSingleProductFile() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Product, SingleActionType.DeleteFile),
    deleteSingleProductFile, { onErrorSaga: errorDeleteSingleProductFile },
  );
}

function* createSingleProductComment(
  action: SingleCreateCommentAction<SingleEntities.Product, ActivityParams>,
) {
  const client = new Client();
  yield call([client, client.addProductComment], action.id, action.data);
  const product: Product = yield call([client, client.getProduct], action.id);
  yield put(setSingle(SingleEntities.Product, product));
}

function* errorCreateSingleProductComment() {
  yield put(errorSingle(SingleEntities.Product));
}

function* watchCreateSingleProductComment() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Product, SingleActionType.CreateComment),
    createSingleProductComment, { onErrorSaga: errorCreateSingleProductComment },
  );
}

function* saveSingleProductActivity(
  action: SingleSaveActivityAction<SingleEntities.Product, ActivityParams>,
) {
  const client = new Client();
  yield call([client, client.updateProductActivity], action.id, action.activityId, action.data);
  const product: Product = yield call([client, client.getProduct], action.id);
  yield put(setSingle(SingleEntities.Product, product));
}

function* errorSaveSingleProductActivity() {
  yield put(errorSingle(SingleEntities.Product));
}

function* watchSaveSingleProductActivity() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Product, SingleActionType.SaveActivity),
    saveSingleProductActivity, { onErrorSaga: errorSaveSingleProductActivity },
  );
}

function* deleteSingleProductActivity(
  action: SingleDeleteActivityAction<SingleEntities.Product>,
) {
  const client = new Client();
  yield call([client, client.deleteProductActivity], action.id, action.activityId);
  const product: Product = yield call([client, client.getProduct], action.id);
  yield put(setSingle(SingleEntities.Product, product));
}

function* errorDeleteSingleProductActivity() {
  yield put(errorSingle(SingleEntities.Product));
}

function* watchDeleteSingleProductActivity() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Product, SingleActionType.DeleteActivity),
    deleteSingleProductActivity, { onErrorSaga: errorDeleteSingleProductActivity },
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
  watchDeleteSingleProduct,
  watchSaveSingleProductFile,
  watchDeleteSingleProductFile,
  watchCreateSingleProductComment,
  watchSaveSingleProductActivity,
  watchDeleteSingleProductActivity,
];
