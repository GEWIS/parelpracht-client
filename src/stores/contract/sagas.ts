import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  ActivityParams,
  Client,
  Contract,
  ContractParams,
  ContractStatusParams,
  ListOrFilter,
  ListParams,
  ListSorting,
  Partial_FileParams,
  SortDirection,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { clearSingle, errorSingle, setSingle } from '../single/actionCreators';
import {
  singleActionPattern,
  SingleActionType,
  SingleCreateAction, SingleCreateCommentAction,
  SingleCreateStatusAction,
  SingleDeleteAction, SingleDeleteActivityAction,
  SingleDeleteFileAction,
  SingleFetchAction,
  SingleSaveAction, SingleSaveActivityAction,
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
import { ETCompany } from '../../helpers/extensiveTableObjects';

function* fetchContracts() {
  const client = new Client();

  const state: TableState<Contract> = yield select(getTable, Tables.Contracts);
  const {
    sortColumn, sortDirection,
    take, skip,
    search, filters,
  } = state;

  const { list, count } = yield call(
    [client, client.getAllContracts],
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
  yield put(setTable(Tables.Contracts, list, count));
}

export function* fetchContractSummaries() {
  const client = new Client();
  const summaries = yield call([client, client.getContractSummaries]);
  yield put(setSummaries(SummaryCollections.Contracts, summaries));
}

function* fetchContractsExtensive() {
  const client = new Client();

  const state: TableState<ETCompany> = yield select(getTable, Tables.ETCompanies);
  const {
    sortColumn, sortDirection,
    take, skip,
    search, filters,
  } = state;

  const { list, count } = yield call(
    [client, client.getAllContractsExtensive],
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
  yield put(setTable(Tables.ETCompanies, list, count));
}

function* fetchSingleContract(action: SingleFetchAction<SingleEntities.Contract>) {
  const client = new Client();
  const contract = yield call([client, client.getContract], action.id);
  yield put(setSingle(SingleEntities.Contract, contract));
}

function* saveSingleContract(
  action: SingleSaveAction<SingleEntities.Contract, ContractParams>,
) {
  const client = new Client();
  yield call([client, client.updateContract], action.id, action.data);
  const contract = yield call([client, client.getContract], action.id);
  yield put(setSingle(SingleEntities.Contract, contract));
  yield put(fetchSummaries(SummaryCollections.Contracts));
}

function* errorSaveSingleContract() {
  yield put(errorSingle(SingleEntities.Contract));
}

function* watchSaveSingleContract() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contract, SingleActionType.Save),
    saveSingleContract,
    { onErrorSaga: errorSaveSingleContract },
  );
}

function* createSingleContract(
  action: SingleCreateAction<SingleEntities.Contract, ContractParams>,
) {
  const client = new Client();
  const contract = yield call([client, client.createContract], action.data);
  yield put(setSingle(SingleEntities.Contract, contract));
  yield put(fetchTable(Tables.Contracts));
  yield put(fetchSummaries(SummaryCollections.Contracts));
}

function* errorCreateSingleContract() {
  yield put(errorSingle(SingleEntities.Contract));
}

function* deleteSingleContract(action: SingleDeleteAction<SingleEntities.Contract>) {
  const client = new Client();
  yield call([client, client.deleteContract], action.id);
  yield put(clearSingle(SingleEntities.Contract));
  yield put(fetchTable(Tables.Contracts));
  yield put(fetchSummaries(SummaryCollections.Contracts));
}

function* errorDeleteSingleContract() {
  yield put(errorSingle(SingleEntities.Contract));
}

function* watchDeleteSingleContract() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contract, SingleActionType.Delete),
    deleteSingleContract, { onErrorSaga: errorDeleteSingleContract },
  );
}

function* watchCreateSingleContract() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contract, SingleActionType.Create),
    createSingleContract,
    { onErrorSaga: errorCreateSingleContract },
  );
}

function* saveSingleContractFile(
  action: SingleSaveFileAction<SingleEntities.Contract, Partial_FileParams>,
) {
  const client = new Client();
  yield call([client, client.updateContractFile], action.id, action.fileId, action.data);
  const contract = yield call([client, client.getContract], action.id);
  yield put(setSingle(SingleEntities.Contract, contract));
}

function* errorSaveSingleContractFile() {
  yield put(errorSingle(SingleEntities.Contract));
}

function* watchSaveSingleContractFile() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contract, SingleActionType.SaveFile),
    saveSingleContractFile, { onErrorSaga: errorSaveSingleContractFile },
  );
}

function* deleteSingleContractFile(action: SingleDeleteFileAction<SingleEntities.Contract>) {
  const client = new Client();
  yield call([client, client.deleteContractFile], action.id, action.fileId);
  const contract = yield call([client, client.getContract], action.id);
  yield put(setSingle(SingleEntities.Contract, contract));
}

function* errorDeleteSingleContractFile() {
  yield put(errorSingle(SingleEntities.Contract));
}

function* watchDeleteSingleContractFile() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contract, SingleActionType.DeleteFile),
    deleteSingleContractFile, { onErrorSaga: errorDeleteSingleContractFile },
  );
}

function* createSingleContractStatus(
  action: SingleCreateStatusAction<SingleEntities.Contract, ContractStatusParams>,
) {
  const client = new Client();
  yield call([client, client.addContractStatus], action.id, action.data);
  const contract = yield call([client, client.getContract], action.id);
  yield put(setSingle(SingleEntities.Contract, contract));
}

function* errorCreateSingleContractStatus() {
  yield put(errorSingle(SingleEntities.Contract));
}

function* watchCreateSingleContractStatus() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contract, SingleActionType.CreateStatus),
    createSingleContractStatus, { onErrorSaga: errorCreateSingleContractStatus },
  );
}

function* createSingleContractComment(
  action: SingleCreateCommentAction<SingleEntities.Contract, ActivityParams>,
) {
  const client = new Client();
  yield call([client, client.addContractComment], action.id, action.data);
  const contract = yield call([client, client.getContract], action.id);
  yield put(setSingle(SingleEntities.Contract, contract));
}

function* errorCreateSingleContractComment() {
  yield put(errorSingle(SingleEntities.Contract));
}

function* watchCreateSingleContractComment() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contract, SingleActionType.CreateComment),
    createSingleContractComment, { onErrorSaga: errorCreateSingleContractComment },
  );
}

function* saveSingleContractActivity(
  action: SingleSaveActivityAction<SingleEntities.Contract, ActivityParams>,
) {
  const client = new Client();
  yield call([client, client.updateContractActivity], action.id, action.activityId, action.data);
  const contract = yield call([client, client.getContract], action.id);
  yield put(setSingle(SingleEntities.Contract, contract));
}

function* errorSaveSingleContractActivity() {
  yield put(errorSingle(SingleEntities.Contract));
}

function* watchSaveSingleContractActivity() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contract, SingleActionType.SaveActivity),
    saveSingleContractActivity, { onErrorSaga: errorSaveSingleContractActivity },
  );
}

function* deleteSingleContractActivity(
  action: SingleDeleteActivityAction<SingleEntities.Contract>,
) {
  const client = new Client();
  yield call([client, client.deleteContractActivity], action.id, action.activityId);
  const contract = yield call([client, client.getContract], action.id);
  yield put(setSingle(SingleEntities.Contract, contract));
}

function* errorDeleteSingleContractActivity() {
  yield put(errorSingle(SingleEntities.Contract));
}

function* watchDeleteSingleContractActivity() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contract, SingleActionType.DeleteActivity),
    deleteSingleContractActivity, { onErrorSaga: errorDeleteSingleContractActivity },
  );
}

export default [
  function* watchFetchContracts() {
    yield throttle(
      500,
      tableActionPattern(Tables.Contracts, TableActionType.Fetch),
      fetchContracts,
    );
  },
  function* watchFetchContractSummaries() {
    yield takeEveryWithErrorHandling(
      summariesActionPattern(
        SummaryCollections.Contracts,
        SummariesActionType.Fetch,
      ),
      fetchContractSummaries,
    );
  },
  function* watchFetchContractsExtensive() {
    yield throttle(
      500,
      tableActionPattern(Tables.ETCompanies, TableActionType.Fetch),
      fetchContractsExtensive,
    );
  },
  function* watchFetchSingleContract() {
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.Contract, SingleActionType.Fetch),
      fetchSingleContract,
    );
  },
  watchSaveSingleContract,
  watchCreateSingleContract,
  watchDeleteSingleContract,
  watchSaveSingleContractFile,
  watchDeleteSingleContractFile,
  watchCreateSingleContractStatus,
  watchCreateSingleContractComment,
  watchSaveSingleContractActivity,
  watchDeleteSingleContractActivity,
];
