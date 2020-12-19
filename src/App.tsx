import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
/* import { BrowserRouter as Router } from 'react-router-dom'; */
import './App.scss';

import store, { history } from './stores/store';
import { Routes } from './Routes';

function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
