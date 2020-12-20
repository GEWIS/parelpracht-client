import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
/* import { BrowserRouter as Router } from 'react-router-dom'; */
import './App.scss';
import './Form.scss';

import store, { history } from './stores/store';
import { Routes } from './Routes';
import { showAlert } from './stores/alerts/actionCreators';
import AlertContainer from './components/alerts/AlertContainer';

interface State {
  hasError: boolean;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  public static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    // tslint:disable-next-line:no-console
    console.error(error, error.stack, info.componentStack);
    store.dispatch(showAlert({
      message: 'An unexpected error occured!',
      title: 'Error',
      type: 'error',
    }));
  }

  public render() {
    if (this.state.hasError) {
      return (
        <AlertContainer />
      );
    }
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
