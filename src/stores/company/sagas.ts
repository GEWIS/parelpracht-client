import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  ActivityParams,
  Client,
  Company,
  CompanyParams,
  CompanySummary,
  ETCompany, ETCompanyListResponse,
  ListOrFilter,
  ListParams,
  ListSorting,
  Partial_FileParams,
  SortDirection,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
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

function toSummary(company: Company): CompanySummary {
  return new CompanySummary({
    id: company.id,
    name: company.name,
    logoFilename: company.logoFilename,
  });
}

function* fetchCompanies() {
  const client = new Client();

  const state: TableState<Company> = yield select(getTable, Tables.Companies);
  const {
    sortColumn, sortDirection,
    take, skip,
    search, filters,
  } = state;

  const { list, count } = yield call(
    [client, client.getAllCompanies],
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
  yield put(setTable(Tables.Companies, list, count, {}));
}

export function* fetchCompanySummaries() {
  const client = new Client();

  // @ts-ignore
  const summaries = yield call([client, client.getCompanySummaries]);
  yield put(setSummaries(SummaryCollections.Companies, summaries));
}

function* fetchCompaniesExtensive() {
  const client = new Client();

  const state: TableState<ETCompany> = yield select(getTable, Tables.ETCompanies);
  const {
    sortColumn, sortDirection,
    take, skip,
    search, filters,
  } = state;

  let { list, count, extra } = yield call(
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

  if (list.length === 0 && count > 0) {
    yield put(prevPageTable(Tables.Companies));

    const res: ETCompanyListResponse = yield call(
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
    list = res.list;
    count = res.count;
    extra = res.extra;
  }

  yield put(setTable(Tables.ETCompanies, list, count, extra));
}

function* fetchSingleCompany(action: SingleFetchAction<SingleEntities.Company>) {
  const client = new Client();
  const company: Company = yield call([client, client.getCompany], action.id);
  yield put(setSingle(SingleEntities.Company, company));
  yield put(updateSummary(SummaryCollections.Companies, toSummary(company)));
}

function* saveSingleCompany(
  action: SingleSaveAction<SingleEntities.Company, CompanyParams>,
) {
  const client = new Client();
  yield call([client, client.updateCompany], action.id, action.data);
  const company: Company = yield call([client, client.getCompany], action.id);
  yield put(setSingle(SingleEntities.Company, company));
  yield put(updateSummary(SummaryCollections.Companies, toSummary(company)));
}

function* errorSaveSingleCompany() {
  yield put(errorSingle(SingleEntities.Company));
}

function* watchSaveSingleCompany() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Company, SingleActionType.Save),
    saveSingleCompany,
    { onErrorSaga: errorSaveSingleCompany },
  );
}

function* createSingleCompany(
  action: SingleCreateAction<SingleEntities.Company, CompanyParams>,
) {
  const client = new Client();
  const company: Company = yield call([client, client.createCompany], action.data);
  yield put(setSingle(SingleEntities.Company, company));
  yield put(fetchTable(Tables.Companies));
  yield put(addSummary(SummaryCollections.Companies, toSummary(company)));
}

function* errorCreateSingleCompany() {
  yield put(errorSingle(SingleEntities.Company));
}

function* watchCreateSingleCompany() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Company, SingleActionType.Create),
    createSingleCompany,
    { onErrorSaga: errorCreateSingleCompany },
  );
}

function* deleteSingleCompany(action: SingleDeleteAction<SingleEntities.Company>) {
  const client = new Client();
  yield call([client, client.deleteCompany], action.id);
  yield put(clearSingle(SingleEntities.Company));
  yield put(fetchTable(Tables.Companies));
  yield put(deleteSummary(SummaryCollections.Companies, action.id));
}

function* errorDeleteSingleCompany() {
  yield put(errorSingle(SingleEntities.Company));
}

function* watchDeleteSingleCompany() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Company, SingleActionType.Delete),
    deleteSingleCompany, { onErrorSaga: errorDeleteSingleCompany },
  );
}

function* saveSingleCompanyFile(
  action: SingleSaveFileAction<SingleEntities.Company, Partial_FileParams>,
) {
  const client = new Client();
  yield call([client, client.updateCompanyFile], action.id, action.fileId, action.data);
  const company: Company = yield call([client, client.getCompany], action.id);
  yield put(setSingle(SingleEntities.Company, company));
}

function* errorSaveSingleCompanyFile() {
  yield put(errorSingle(SingleEntities.Company));
}

function* watchSaveSingleCompanyFile() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Company, SingleActionType.SaveFile),
    saveSingleCompanyFile, { onErrorSaga: errorSaveSingleCompanyFile },
  );
}

function* deleteSingleCompanyFile(action: SingleDeleteFileAction<SingleEntities.Company>) {
  const client = new Client();
  yield call([client, client.deleteCompanyFile], action.id, action.fileId);
  const company: Company = yield call([client, client.getCompany], action.id);
  yield put(setSingle(SingleEntities.Company, company));
}

function* errorDeleteSingleCompanyFile() {
  yield put(errorSingle(SingleEntities.Company));
}

function* watchDeleteSingleCompanyFile() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Company, SingleActionType.DeleteFile),
    deleteSingleCompanyFile, { onErrorSaga: errorDeleteSingleCompanyFile },
  );
}

function* createSingleCompanyComment(
  action: SingleCreateCommentAction<SingleEntities.Company, ActivityParams>,
) {
  const client = new Client();
  yield call([client, client.addCompanyComment], action.id, action.data);
  const company: Company = yield call([client, client.getCompany], action.id);
  yield put(setSingle(SingleEntities.Company, company));
}

function* errorCreateSingleCompanyComment() {
  yield put(errorSingle(SingleEntities.Company));
}

function* watchCreateSingleCompanyComment() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Company, SingleActionType.CreateComment),
    createSingleCompanyComment, { onErrorSaga: errorCreateSingleCompanyComment },
  );
}

function* saveSingleCompanyActivity(
  action: SingleSaveActivityAction<SingleEntities.Company, ActivityParams>,
) {
  const client = new Client();
  yield call([client, client.updateCompanyActivity], action.id, action.activityId, action.data);
  const company: Company = yield call([client, client.getCompany], action.id);
  yield put(setSingle(SingleEntities.Company, company));
}

function* errorSaveSingleCompanyActivity() {
  yield put(errorSingle(SingleEntities.Company));
}

function* watchSaveSingleCompanyActivity() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Company, SingleActionType.SaveActivity),
    saveSingleCompanyActivity, { onErrorSaga: errorSaveSingleCompanyActivity },
  );
}

function* deleteSingleCompanyActivity(
  action: SingleDeleteActivityAction<SingleEntities.Company>,
) {
  const client = new Client();
  yield call([client, client.deleteCompanyActivity], action.id, action.activityId);
  const company: Company = yield call([client, client.getCompany], action.id);
  yield put(setSingle(SingleEntities.Company, company));
}

function* errorDeleteSingleCompanyActivity() {
  yield put(errorSingle(SingleEntities.Company));
}

function* watchDeleteSingleCompanyActivity() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Company, SingleActionType.DeleteActivity),
    deleteSingleCompanyActivity, { onErrorSaga: errorDeleteSingleCompanyActivity },
  );
}

export default [
  function* watchFetchCompanies() {
    yield throttle(
      500,
      tableActionPattern(Tables.Companies, TableActionType.Fetch),
      fetchCompanies,
    );
  },
  function* watchFetchCompanySummaries() {
    yield takeEveryWithErrorHandling(
      summariesActionPattern(
        SummaryCollections.Companies,
        SummariesActionType.Fetch,
      ),
      fetchCompanySummaries,
    );
  },
  function* watchFetchContractsExtensive() {
    yield throttle(
      500,
      tableActionPattern(Tables.ETCompanies, TableActionType.Fetch),
      fetchCompaniesExtensive,
    );
  },
  function* watchFetchSingleCompany() {
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.Company, SingleActionType.Fetch),
      fetchSingleCompany,
    );
  },
  watchSaveSingleCompany,
  watchCreateSingleCompany,
  watchDeleteSingleCompany,
  watchSaveSingleCompanyFile,
  watchDeleteSingleCompanyFile,
  watchCreateSingleCompanyComment,
  watchSaveSingleCompanyActivity,
  watchDeleteSingleCompanyActivity,
];
