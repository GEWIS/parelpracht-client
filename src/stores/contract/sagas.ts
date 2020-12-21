import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import { Client, Dir3, Contract } from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { fetchTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';
import {
  setSingleContract,
  errorSingleContract,
} from './actionCreators';
import {
  ContractActionType, ContractsCreateSingleAction, ContractsFetchSingleAction,
  ContractsSaveSingleAction,
} from './actions';

function* fetchContracts() {
  const client = new Client();

  const state: TableState<Contract> = yield select(getTable, Tables.Contracts);
  const {
    sortColumn, sortDirection,
    take, skip,
    search,
  } = state;

  const { list, count } = yield call(
    [client, client.getAllContracts], sortColumn, sortDirection as Dir3,
    skip, take, search,
  );
  yield put(setTable(Tables.Contracts, list, count));
}

function* fetchSingleContract(action: ContractsFetchSingleAction) {
  const client = new Client();
  const contract = yield call([client, client.getContract], action.id);
  yield put(setSingleContract(contract));
}

function* saveSingleContract(action: ContractsSaveSingleAction) {
  const client = new Client();
  yield call([client, client.updateContract], action.id, action.contract);
  const contract = yield call([client, client.getContract], action.id);
  yield put(setSingleContract(contract));
}

function* errorSaveSingleContract() {
  yield put(errorSingleContract());
}

function* watchSaveSingleContract() {
  yield takeEveryWithErrorHandling(
    ContractActionType.SaveSingle,
    saveSingleContract,
    { onErrorSaga: errorSaveSingleContract },
  );
}

function* createSingleContract(action: ContractsCreateSingleAction) {
  const client = new Client();
  const contract = yield call([client, client.createContract], action.contract);
  yield put(setSingleContract(contract));
  yield put(fetchTable(Tables.Contracts));
}

function* errorCreateSingleContract() {
  yield put(errorSingleContract());
}

function* watchCreateSingleContract() {
  yield takeEveryWithErrorHandling(
    ContractActionType.CreateSingle,
    createSingleContract,
    { onErrorSaga: errorCreateSingleContract },
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
  function* watchFetchSingleContract() {
    yield takeEveryWithErrorHandling(ContractActionType.FetchSingle, fetchSingleContract);
  },
  watchSaveSingleContract,
  watchCreateSingleContract,
];
