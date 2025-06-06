import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  ApiException,
  CategoryParams,
  Client,
  ListOrFilter,
  ListParams,
  ListSorting,
  SortDirection, ValueAddedTax, VATListResponse, VATSummary,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import {
  errorSingle, notFoundSingle, setSingle,
} from '../single/actionCreators';
import {
  singleActionPattern,
  SingleActionType,
  SingleFetchAction,
  SingleSaveAction,
} from '../single/actions';
import { SingleEntities } from '../single/single';
import {
  setSummaries, updateSummary,
} from '../summaries/actionCreators';
import { summariesActionPattern, SummariesActionType } from '../summaries/actions';
import { SummaryCollections } from '../summaries/summaries';
import { fetchTable, prevPageTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';

function toSummary(valueAddedTax: ValueAddedTax): VATSummary {
  return new VATSummary({
    id: valueAddedTax.id,
    amount: valueAddedTax.amount,
  });
}

function* fetchValueAddedTax() {
  const client = new Client();

  const state: TableState<ValueAddedTax> = yield select(getTable, Tables.ValueAddedTax);
  const {
    sortColumn, sortDirection,
    take, skip,
    search, filters,
  } = state;

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
    yield put(prevPageTable(Tables.ValueAddedTax));

    const res: VATListResponse = yield call(
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

  yield put(setTable(Tables.ValueAddedTax, list, count, {}));
}

export function* fetchValueAddedTaxSummaries() {
  const client = new Client();
  const summaries: VATSummary[] = yield call([client, client.getVATSummaries]);
  yield put(setSummaries(SummaryCollections.ValueAddedTax, summaries));
}

function* fetchSingleValueAddedTax(action: SingleFetchAction<SingleEntities.ValueAddedTax>) {
  const client = new Client();
  const valueAddedTax: ValueAddedTax = yield call([client, client.getVAT], action.id);
  yield put(setSingle(SingleEntities.ValueAddedTax, valueAddedTax));
  yield put(updateSummary(SummaryCollections.ValueAddedTax, toSummary(valueAddedTax)));
}

function* errorFetchSingleValueAddedTax(
  error: ApiException,
) {
  if (error.status === 404) {
    yield put(notFoundSingle(SingleEntities.ValueAddedTax));
  } else {
    yield put(errorSingle(SingleEntities.ValueAddedTax));
  }
}

function* saveSingleValueAddedTax(
  action: SingleSaveAction<SingleEntities.ValueAddedTax, CategoryParams>,
) {
  const client = new Client();
  yield call([client, client.updateVAT], action.id, action.data);
  const valueAddedTax: ValueAddedTax = yield call([client, client.getVAT], action.id);
  yield put(setSingle(SingleEntities.ValueAddedTax, valueAddedTax));
  yield put(fetchTable(Tables.ValueAddedTax));
  yield put(updateSummary(SummaryCollections.ValueAddedTax, toSummary(valueAddedTax)));
}

function* errorSaveSingleValueAddedTax() {
  yield put(errorSingle(SingleEntities.ValueAddedTax));
}

function* watchSaveSingleValueAddedTax() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.ValueAddedTax, SingleActionType.Save),
    saveSingleValueAddedTax,
    { onErrorSaga: errorSaveSingleValueAddedTax },
  );
}

// function* createSingleProductCategory(
//   action: SingleCreateAction<SingleEntities.ProductCategory, CategoryParams>,
// ) {
//   const client = new Client();
 
//   const productCategory: ProductCategory = yield call([client, client.createCategory], action.data);
//   yield put(setSingle(SingleEntities.ProductCategory, productCategory));
//   yield put(fetchTable(Tables.ProductCategories));
//   yield put(addSummary(SummaryCollections.ProductCategories, toSummary(productCategory)));
// }
//
// function* errorCreateSingleProductCategory() {
//   yield put(errorSingle(SingleEntities.ProductCategory));
// }
//
// function* watchCreateSingleProductCategory() {
//   yield takeEveryWithErrorHandling(
//     singleActionPattern(SingleEntities.ProductCategory, SingleActionType.Create),
//     createSingleProductCategory,
//     { onErrorSaga: errorCreateSingleProductCategory },
//   );
// }
//
 
// function* deleteSingleProductCategory(action: SingleDeleteAction<SingleEntities.ProductCategory>) {
//   const client = new Client();
//   yield call([client, client.deleteCategory], action.id);
//   yield put(clearSingle(SingleEntities.ProductCategory));
//   yield put(fetchTable(Tables.ProductCategories));
//   yield put(deleteSummary(SummaryCollections.ProductCategories, action.id));
// }
//
// function* errorDeleteSingleProductCategory() {
//   yield put(errorSingle(SingleEntities.ProductCategory));
// }
//
// function* watchDeleteSingleProductCategory() {
//   yield takeEveryWithErrorHandling(
//     singleActionPattern(SingleEntities.ProductCategory, SingleActionType.Delete),
//     deleteSingleProductCategory, { onErrorSaga: errorDeleteSingleProductCategory },
//   );
// }

export default [
  function* watchFetchProductCategories() {
    yield throttle(
      500,
      tableActionPattern(Tables.ProductCategories, TableActionType.Fetch),
      fetchValueAddedTax,
    );
  },
  function* watchFetchValueAddedTaxSummaries() {
    yield takeEveryWithErrorHandling(
      summariesActionPattern(
        SummaryCollections.ValueAddedTax,
        SummariesActionType.Fetch,
      ),
      fetchValueAddedTaxSummaries,
    );
  },
  function* watchFetchSingleValueAddedTax() {
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.ValueAddedTax, SingleActionType.Fetch),
      fetchSingleValueAddedTax,
      { onErrorSaga: errorFetchSingleValueAddedTax },
    );
  },
  watchSaveSingleValueAddedTax,
];
