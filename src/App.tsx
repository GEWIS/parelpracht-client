import { ReduxRouter, ReduxRouterSelector } from '@lagunovsky/redux-react-router';
import './App.scss';
import './Form.scss';

import store, { history, RootState } from './stores/store';
import Routes from './Routes';
import { showAlert } from './stores/alerts/actionCreators';
import AlertContainer from './components/alerts/AlertContainer';

interface State {
  hasError: boolean;
}

class App extends React.Component<object, State> {
  constructor(props: object) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  public static getDerivedStateFromError() {
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

  private getContent() {
    if (this.state.hasError) {
      return (
        <AlertContainer />
      );
    }
    return (
      <Routes />
    );
  }

  public render() {
    if (this.state.hasError) {
      return (
        <AlertContainer />
      );
    }
    const routerSelector: ReduxRouterSelector<RootState> = (state) => state.router;
    return (
      <ReduxRouter history={history} routerSelector={routerSelector}>
        {this.getContent()}
      </ReduxRouter>
    );
  }
}

export default App;
