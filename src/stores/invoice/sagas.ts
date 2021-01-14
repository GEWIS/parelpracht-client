import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  Client, Invoice, InvoiceParams, ListOrFilter, ListParams, ListSorting, Partial_FileParams,
  SortDirection,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { clearSingle, errorSingle, setSingle } from '../single/actionCreators';
import {
  singleActionPattern, SingleActionType, SingleCreateAction, SingleDeleteAction,
  SingleDeleteFileAction, SingleFetchAction, SingleSaveAction, SingleSaveFileAction,
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

function* fetchInvoices() {
  const client = new Client();

  const state: TableState<Invoice> = yield select(getTable, Tables.Invoices);
  const {
    sortColumn, sortDirection,
    take, skip,
    search, filters,
  } = state;

  const { list, count } = yield call(
    [client, client.getAllInvoices],
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
  yield put(setTable(Tables.Invoices, list, count));
}

export function* fetchInvoiceSummaries() {
  const client = new Client();
  const summaries = yield call([client, client.getInvoiceSummaries]);
  yield put(setSummaries(SummaryCollections.Invoices, summaries));
}

function* fetchSingleInvoice(action: SingleFetchAction<SingleEntities.Invoice>) {
  const client = new Client();
  const invoice = yield call([client, client.getInvoice], action.id);
  yield put(setSingle(SingleEntities.Invoice, invoice));
}

function* saveSingleInvoice(
  action: SingleSaveAction<SingleEntities.Invoice, InvoiceParams>,
) {
  const client = new Client();
  yield call([client, client.updateInvoice], action.id, action.data);
  const invoice = yield call([client, client.getInvoice], action.id);
  yield put(setSingle(SingleEntities.Invoice, invoice));
}

function* errorSaveSingleInvoice() {
  yield put(errorSingle(SingleEntities.Invoice));
}

function* watchSaveSingleInvoice() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Invoice, SingleActionType.Save),
    saveSingleInvoice,
    { onErrorSaga: errorSaveSingleInvoice },
  );
}

function* createSingleInvoice(
  action: SingleCreateAction<SingleEntities.Invoice, InvoiceParams>,
) {
  const client = new Client();
  const invoice = yield call([client, client.createInvoice], action.data);
  yield put(setSingle(SingleEntities.Invoice, invoice));
  yield put(fetchTable(Tables.Invoices));
}

function* errorCreateSingleInvoice() {
  yield put(errorSingle(SingleEntities.Invoice));
}

function* watchCreateSingleInvoice() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Invoice, SingleActionType.Create),
    createSingleInvoice,
    { onErrorSaga: errorCreateSingleInvoice },
  );
}

function* deleteSingleInvoice(action: SingleDeleteAction<SingleEntities.Invoice>) {
  const client = new Client();
  yield call([client, client.deleteInvoice], action.id);
  yield put(clearSingle(SingleEntities.Invoice));
}

function* errorDeleteSingleInvoice() {
  yield put(errorSingle(SingleEntities.Invoice));
}

function* watchDeleteSingleInvoice() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Invoice, SingleActionType.Delete),
    deleteSingleInvoice, { onErrorSaga: errorDeleteSingleInvoice },
  );
}

function* saveSingleInvoiceFile(
  action: SingleSaveFileAction<SingleEntities.Invoice, Partial_FileParams>,
) {
  const client = new Client();
  yield call([client, client.updateInvoiceFile], action.id, action.fileId, action.data);
  const invoice = yield call([client, client.getInvoice], action.id);
  yield put(setSingle(SingleEntities.Invoice, invoice));
}

function* errorSaveSingleInvoiceFile() {
  yield put(errorSingle(SingleEntities.Invoice));
}

function* watchSaveSingleInvoiceFile() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Invoice, SingleActionType.SaveFile),
    saveSingleInvoiceFile, { onErrorSaga: errorSaveSingleInvoiceFile },
  );
}

function* deleteSingleInvoiceFile(action: SingleDeleteFileAction<SingleEntities.Invoice>) {
  const client = new Client();
  yield call([client, client.deleteInvoiceFile], action.id, action.fileId);
  const invoice = yield call([client, client.getInvoice], action.id);
  yield put(setSingle(SingleEntities.Invoice, invoice));
}

function* errorDeleteSingleInvoiceFile() {
  yield put(errorSingle(SingleEntities.Invoice));
}

function* watchDeleteSingleInvoiceFile() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Invoice, SingleActionType.DeleteFile),
    deleteSingleInvoiceFile, { onErrorSaga: errorDeleteSingleInvoiceFile },
  );
}

export default [
  function* watchFetchInvoices() {
    yield throttle(
      500,
      tableActionPattern(Tables.Invoices, TableActionType.Fetch),
      fetchInvoices,
    );
  },
  function* watchFetchInvoiceSummaries() {
    yield takeEveryWithErrorHandling(
      summariesActionPattern(
        SummaryCollections.Invoices,
        SummariesActionType.Fetch,
      ),
      fetchInvoiceSummaries,
    );
  },
  function* watchFetchSingleInvoice() {
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.Invoice, SingleActionType.Fetch),
      fetchSingleInvoice,
    );
  },
  watchSaveSingleInvoice,
  watchCreateSingleInvoice,
  watchDeleteSingleInvoice,
  watchSaveSingleInvoiceFile,
  watchDeleteSingleInvoiceFile,
];
