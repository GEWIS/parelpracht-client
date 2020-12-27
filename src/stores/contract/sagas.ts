import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  Client, Dir3, Contract, ContractParams,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { errorSingle, setSingle } from '../single/actionCreators';
import {
  singleActionPattern, SingleActionType, SingleCreateAction, SingleFetchAction, SingleSaveAction,
} from '../single/actions';
import { SingleEntities } from '../single/single';
import { fetchTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';

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
}

function* errorCreateSingleContract() {
  yield put(errorSingle(SingleEntities.Contract));
}

function* watchCreateSingleContract() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contract, SingleActionType.Create),
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
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.Contract, SingleActionType.Fetch),
      fetchSingleContract,
    );
  },
  watchSaveSingleContract,
  watchCreateSingleContract,
];
