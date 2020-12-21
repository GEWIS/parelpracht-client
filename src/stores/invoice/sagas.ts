import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import { Client, Dir4, Invoice } from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { fetchTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';
import {
  setSingleInvoice,
  errorSingleInvoice,
} from './actionCreators';
import {
  InvoiceActionType, InvoicesCreateSingleAction, InvoicesFetchSingleAction,
  InvoicesSaveSingleAction,
} from './actions';

function* fetchInvoices() {
  const client = new Client();

  const state: TableState<Invoice> = yield select(getTable, Tables.Invoices);
  const {
    sortColumn, sortDirection,
    take, skip,
    search,
  } = state;

  const { list, count } = yield call(
    [client, client.getAllInvoices], sortColumn, sortDirection as Dir4,
    skip, take, search,
  );
  yield put(setTable(Tables.Invoices, list, count));
}

function* fetchSingleInvoice(action: InvoicesFetchSingleAction) {
  const client = new Client();
  const invoice = yield call([client, client.getInvoice], action.id);
  yield put(setSingleInvoice(invoice));
}

function* saveSingleInvoice(action: InvoicesSaveSingleAction) {
  const client = new Client();
  yield call([client, client.updateInvoice], action.id, action.invoice);
  const invoice = yield call([client, client.getInvoice], action.id);
  yield put(setSingleInvoice(invoice));
}

function* errorSaveSingleInvoice() {
  yield put(errorSingleInvoice());
}

function* watchSaveSingleInvoice() {
  yield takeEveryWithErrorHandling(
    InvoiceActionType.SaveSingle,
    saveSingleInvoice,
    { onErrorSaga: errorSaveSingleInvoice },
  );
}

function* createSingleInvoice(action: InvoicesCreateSingleAction) {
  const client = new Client();
  const invoice = yield call([client, client.createInvoice], action.invoice);
  yield put(setSingleInvoice(invoice));
  yield put(fetchTable(Tables.Invoices));
}

function* errorCreateSingleInvoice() {
  yield put(errorSingleInvoice());
}

function* watchCreateSingleInvoice() {
  yield takeEveryWithErrorHandling(
    InvoiceActionType.CreateSingle,
    createSingleInvoice,
    { onErrorSaga: errorCreateSingleInvoice },
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
  function* watchFetchSingleInvoice() {
    yield takeEveryWithErrorHandling(InvoiceActionType.FetchSingle, fetchSingleInvoice);
  },
  watchSaveSingleInvoice,
  watchCreateSingleInvoice,
];
