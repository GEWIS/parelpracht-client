import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';

import authReducer from './auth/reducer';
import alertsReducer from './alerts/reducer';
import generalReducer from './general/reducer';

import authSagas, { fetchAuthStatus } from './auth/sagas';
import alertsSagas from './alerts/sagas';
import generalSagas from './general/sagas';
import productSagas from './product/sagas';
import productCategorySagas from './productcategory/sagas';
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

export const history = createBrowserHistory();

const createRootReducer = (historyObject: any) => combineReducers({
  ...reducers,
  router: connectRouter(historyObject),
});

export type RootState = {
  [P in keyof typeof reducers]: ReturnType<typeof reducers[P]>;
} & {
  router: RouterState<any>;
};

function* rootSaga() {
  // Check authentication status at start
  yield fork(fetchAuthStatus);

  // Watch sagas
  yield all(watchSagas.map((saga) => saga()));
}

// Create store
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  createRootReducer(history),
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(routerMiddleware(history), sagaMiddleware))
    : applyMiddleware(routerMiddleware(history), sagaMiddleware),
);

sagaMiddleware.run(rootSaga);

export default store;
