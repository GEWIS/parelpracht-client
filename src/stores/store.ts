import { combineReducers } from 'redux';
import { BrowserHistory, createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { createRouterReducer, createRouterMiddleware } from '@lagunovsky/redux-react-router';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/reducer';
import alertsReducer from './alerts/reducer';
import generalReducer from './general/reducer';

import authSagas, { fetchAuthStatus } from './auth/sagas';
import alertsSagas from './alerts/sagas';
import generalSagas, { fetchGeneralPublicInfo } from './general/sagas';
import productSagas from './product/sagas';
import productCategorySagas from './productcategory/sagas';
import valueAddedTaxSagas from './vat/sagas';
import productInstanceSagas from './productinstance/sagas';
import contactSagas from './contact/sagas';
import companySagas from './company/sagas';
import contractSagas from './contract/sagas';
import invoiceSagas from './invoice/sagas';
import userSagas from './user/sagas';

import { tablesReducer } from './tables/reducer';
import { singleEntitiesReducer } from './single/reducer';
import { summariesReducer } from './summaries/reducer';


// Import all watching sagas
const watchSagas = [
  ...authSagas,
  ...alertsSagas,
  ...generalSagas,
  ...productSagas,
  ...productCategorySagas,
  ...valueAddedTaxSagas,
  ...productInstanceSagas,
  ...companySagas,
  ...contactSagas,
  ...invoiceSagas,
  ...contractSagas,
  ...userSagas,
];

// Set up root reducer
const reducers = {
  auth: authReducer,
  alerts: alertsReducer,
  general: generalReducer,
  tables: tablesReducer,
  summaries: summariesReducer,
  single: singleEntitiesReducer,
};

const createRootReducer = (historyObject: BrowserHistory) => combineReducers({
  ...reducers,
  router: createRouterReducer(historyObject),
});

function* rootSaga() {
  // Fetch general information
  yield fetchGeneralPublicInfo();

  // Check authentication status at start
  yield fork(fetchAuthStatus);

  // Watch sagas
  yield all(watchSagas.map((saga) => saga()));
}

export type RootState = ReturnType<typeof store.getState>;

export const history = createBrowserHistory();
const routerMiddleware = createRouterMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: createRootReducer(history),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).prepend(sagaMiddleware).prepend(routerMiddleware),
  // devTools: process.env.NODE_ENV === 'development',
});
sagaMiddleware.run(rootSaga);

export default store;
