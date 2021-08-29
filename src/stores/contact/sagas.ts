import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  ApiException,
  Client,
  Contact, ContactListResponse,
  ContactParams,
  ContactSummary,
  ListOrFilter,
  ListParams,
  ListSorting,
  SortDirection,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import {
  clearSingle, errorSingle, notFoundSingle, setSingle,
} from '../single/actionCreators';
import {
  singleActionPattern,
  SingleActionType,
  SingleCreateAction,
  SingleDeleteAction,
  SingleFetchAction,
  SingleSaveAction,
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

function toSummary(contact: Contact): ContactSummary {
  return new ContactSummary({
    id: contact.id,
    firstName: contact.firstName,
    lastNamePreposition: contact.lastNamePreposition,
    lastName: contact.lastName,
    companyId: contact.companyId,
    function: contact.function,
  });
}

function* fetchContacts() {
  const client = new Client();

  const state: TableState<Contact> = yield select(getTable, Tables.Contacts);
  const {
    sortColumn, sortDirection,
    take, skip,
    search, filters,
  } = state;

  let { list, count } = yield call(
    [client, client.getAllContacts],
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
    yield put(prevPageTable(Tables.Contacts));

    const res: ContactListResponse = yield call(
      [client, client.getAllContacts],
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

  yield put(setTable(Tables.Contacts, list, count, {}));
}

export function* fetchContactSummaries() {
  const client = new Client();
  const summaries: ContactSummary[] = yield call([client, client.getContactSummaries]);
  yield put(setSummaries(SummaryCollections.Contacts, summaries));
}

function* fetchSingleContact(action: SingleFetchAction<SingleEntities.Contact>) {
  const client = new Client();
  const contact: Contact = yield call([client, client.getContact], action.id);
  yield put(setSingle(SingleEntities.Contact, contact));
  yield put(updateSummary(SummaryCollections.Contacts, toSummary(contact)));
}

function* errorFetchSingleContact(
  error: ApiException,
) {
  if (error.status === 404) {
    yield put(notFoundSingle(SingleEntities.Contact));
  } else {
    yield put(errorSingle(SingleEntities.Contact));
  }
}

function* saveSingleContact(
  action: SingleSaveAction<SingleEntities.Contact, ContactParams>,
) {
  const client = new Client();
  yield call([client, client.updateContact], action.id, action.data);
  const contact: Contact = yield call([client, client.getContact], action.id);
  yield put(setSingle(SingleEntities.Contact, contact));
  yield put(fetchTable(Tables.Contacts));
  yield put(updateSummary(SummaryCollections.Contacts, toSummary(contact)));
}

function* errorSaveSingleContact() {
  yield put(errorSingle(SingleEntities.Contact));
}

function* watchSaveSingleContact() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contact, SingleActionType.Save),
    saveSingleContact,
    { onErrorSaga: errorSaveSingleContact },
  );
}

function* createSingleContact(
  action: SingleCreateAction<SingleEntities.Contact, ContactParams>,
) {
  const client = new Client();
  const contact: Contact = yield call([client, client.createContact], action.data);
  yield put(setSingle(SingleEntities.Contact, contact));
  yield put(fetchTable(Tables.Contacts));
  yield put(addSummary(SummaryCollections.Contacts, toSummary(contact)));
}

function* errorCreateSingleContact() {
  yield put(errorSingle(SingleEntities.Contact));
}

function* watchCreateSingleContact() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contact, SingleActionType.Create),
    createSingleContact,
    { onErrorSaga: errorCreateSingleContact },
  );
}

function* deleteSingleContact(action: SingleDeleteAction<SingleEntities.Contact>) {
  const client = new Client();
  yield call([client, client.deleteContact], action.id);
  yield put(clearSingle(SingleEntities.Contact));
  yield put(fetchTable(Tables.Contacts));
  yield put(deleteSummary(SummaryCollections.Contacts, action.id));
}

function* errorDeleteSingleContact() {
  yield put(errorSingle(SingleEntities.Contact));
}

function* watchDeleteSingleContact() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contact, SingleActionType.Delete),
    deleteSingleContact, { onErrorSaga: errorDeleteSingleContact },
  );
}

export default [
  function* watchFetchContacts() {
    yield throttle(
      500,
      tableActionPattern(Tables.Contacts, TableActionType.Fetch),
      fetchContacts,
    );
  },
  function* watchFetchContactSummaries() {
    yield takeEveryWithErrorHandling(
      summariesActionPattern(
        SummaryCollections.Contacts,
        SummariesActionType.Fetch,
      ),
      fetchContactSummaries,
    );
  },
  function* watchFetchSingleContact() {
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.Contact, SingleActionType.Fetch),
      fetchSingleContact,
      { onErrorSaga: errorFetchSingleContact },
    );
  },
  watchSaveSingleContact,
  watchCreateSingleContact,
  watchDeleteSingleContact,
];
