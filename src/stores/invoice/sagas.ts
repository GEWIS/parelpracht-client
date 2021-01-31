import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  ActivityParams,
  Client, Contract,
  Invoice,
  InvoiceParams,
  InvoiceStatusParams,
  ListOrFilter,
  ListParams,
  ListSorting,
  Partial_FileParams,
  SortDirection,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import {
  clearSingle, errorSingle, fetchSingle, setSingle,
} from '../single/actionCreators';
import {
  singleActionPattern,
  SingleActionType,
  SingleCreateAction,
  SingleCreateCommentAction,
  SingleCreateStatusAction,
  SingleDeleteAction,
  SingleDeleteActivityAction,
  SingleDeleteFileAction,
  SingleFetchAction,
  SingleSaveAction,
  SingleSaveActivityAction,
  SingleSaveFileAction,
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
import { SingleEntityState } from '../single/singleState';
import { getSingle } from '../single/selectors';

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
  yield put(fetchSummaries(SummaryCollections.Invoices));
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
  yield put(fetchSummaries(SummaryCollections.Invoices));

  const contractState: SingleEntityState<Contract> = yield select(getSingle,
    SingleEntities.Contract);
  console.log(contractState);
  if (contractState.data) {
    yield put(fetchSingle(SingleEntities.Contract, contractState.data.id));
  }
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
  yield put(fetchSummaries(SummaryCollections.Invoices));
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

function* createSingleInvoiceStatus(
  action: SingleCreateStatusAction<SingleEntities.Invoice, InvoiceStatusParams>,
) {
  const client = new Client();
  yield call([client, client.addInvoiceStatus], action.id, action.data);
  const invoice = yield call([client, client.getInvoice], action.id);
  yield put(setSingle(SingleEntities.Invoice, invoice));
}

function* errorCreateSingleInvoiceStatus() {
  yield put(errorSingle(SingleEntities.Invoice));
}

function* watchCreateSingleInvoiceStatus() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Invoice, SingleActionType.CreateStatus),
    createSingleInvoiceStatus, { onErrorSaga: errorCreateSingleInvoiceStatus },
  );
}

function* createSingleInvoiceComment(
  action: SingleCreateCommentAction<SingleEntities.Invoice, ActivityParams>,
) {
  const client = new Client();
  yield call([client, client.addInvoiceComment], action.id, action.data);
  const invoice = yield call([client, client.getInvoice], action.id);
  yield put(setSingle(SingleEntities.Invoice, invoice));
}

function* errorCreateSingleInvoiceComment() {
  yield put(errorSingle(SingleEntities.Invoice));
}

function* watchCreateSingleInvoiceComment() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Invoice, SingleActionType.CreateComment),
    createSingleInvoiceComment, { onErrorSaga: errorCreateSingleInvoiceComment },
  );
}

function* saveSingleInvoiceActivity(
  action: SingleSaveActivityAction<SingleEntities.Invoice, ActivityParams>,
) {
  const client = new Client();
  yield call([client, client.updateInvoiceActivity], action.id, action.activityId, action.data);
  const invoice = yield call([client, client.getInvoice], action.id);
  yield put(setSingle(SingleEntities.Invoice, invoice));
}

function* errorSaveSingleInvoiceActivity() {
  yield put(errorSingle(SingleEntities.Invoice));
}

function* watchSaveSingleInvoiceActivity() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Invoice, SingleActionType.SaveActivity),
    saveSingleInvoiceActivity, { onErrorSaga: errorSaveSingleInvoiceActivity },
  );
}

function* deleteSingleInvoiceActivity(
  action: SingleDeleteActivityAction<SingleEntities.Invoice>,
) {
  const client = new Client();
  yield call([client, client.deleteInvoiceActivity], action.id, action.activityId);
  const invoice = yield call([client, client.getInvoice], action.id);
  yield put(setSingle(SingleEntities.Invoice, invoice));
}

function* errorDeleteSingleInvoiceActivity() {
  yield put(errorSingle(SingleEntities.Invoice));
}

function* watchDeleteSingleInvoiceActivity() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Invoice, SingleActionType.DeleteActivity),
    deleteSingleInvoiceActivity, { onErrorSaga: errorDeleteSingleInvoiceActivity },
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
  watchCreateSingleInvoiceStatus,
  watchCreateSingleInvoiceComment,
  watchSaveSingleInvoiceActivity,
  watchDeleteSingleInvoiceActivity,
];
