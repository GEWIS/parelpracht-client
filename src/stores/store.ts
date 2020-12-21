import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';

import alertsReducer from './alerts/reducer';
import productReducer from './product/reducer';
import companyReducer from './company/reducer';

import alertsSagas from './alerts/sagas';
import productSagas from './product/sagas';
import contactSagas from './contact/sagas';
import companySagas from './company/sagas';
import { tablesReducer } from './tables/reducer';

// Import all watching sagas
const watchSagas = [
  ...alertsSagas,
  ...productSagas,
  ...companySagas,
  ...contactSagas,
];

// Set up root reducer
const reducers = {
  alerts: alertsReducer,
  product: productReducer,
  tables: tablesReducer,
  company: companyReducer,
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
