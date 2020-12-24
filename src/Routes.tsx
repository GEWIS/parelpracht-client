import * as React from 'react';
import {
  withRouter, Switch, Route, NavLink, RouteComponentProps, Redirect,
} from 'react-router-dom';
import {
  Container, Dimmer, Header, Icon, Loader, Menu,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import _ from 'lodash';
import ProductsPage from './pages/ProductsPage';
import SingleProductPage from './pages/SingleProductPage';
import ProductCreatePage from './pages/ProductCreatePage';
import CompaniesPage from './pages/CompaniesPage';
import SingleCompanyPage from './pages/SingleCompanyPage';
import CompaniesCreatePage from './pages/CompaniesCreatePage';
import AlertContainer from './components/alerts/AlertContainer';
import ContactsPage from './pages/ContactPage';
import InvoicesPage from './pages/InvoicesPage';
import SingleInvoicePage from './pages/SingleInvoicePage';
/* import SingleProductPage from './pages/SingleProductPage'; */
import ContractsPage from './pages/ContractsPage';
import SingleContractPage from './pages/SingleContractPage';
import ContractsCreatePage from './pages/ContractCreatePage';
import Navigation from './components/navigation/Navigation';
import { RootState } from './stores/store';
import ResourceStatus from './stores/resourceStatus';
import { AuthStatus, User } from './clients/server.generated';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

interface Props extends RouteComponentProps {
  // eslint-disable-next-line react/no-unused-prop-types
  authStatus: AuthStatus | undefined;
  status: ResourceStatus;
}

function Routes(props: Props) {
  if (props.status !== ResourceStatus.FETCHED || props.authStatus === undefined) {
    return (
      <Container>
        <Dimmer active page inverted>

          <Header as="h2" icon>
            <Loader inline content="CRM" size="large" />
            <Header.Subheader>Checking login information...</Header.Subheader>
          </Header>
        </Dimmer>
      </Container>
    );
  }

  if (!props.authStatus.authenticated) {
    if (_.find(['/login', 'forgot-password', '/reset-password'], props.location.pathname) !== undefined) {
      return (
        <Redirect to="/login" />
      );
    }
    return (
      <Switch>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Route path="/forgot-password" exact>
          <ForgotPasswordPage />
        </Route>
        <Route path="/reset-password" exact>
          <ResetPasswordPage />
        </Route>
      </Switch>
    );
  }

  return (
    <div>
      <Navigation />
      <Container
        className="main"
        fluid
      >
        <AlertContainer internal />
        <Switch>
          {/* Product */}
          <Route path="/product" exact>
            <ProductsPage />
          </Route>
          <Route path="/product/new" exact>
            <ProductsPage />
            <ProductCreatePage />
          </Route>
          <Route path="/product/:productId" exact component={SingleProductPage} />
          {/* Company */}
          <Route path="/company" exact>
            <CompaniesPage />
          </Route>
          <Route path="/company/new" exact>
            <CompaniesPage />
            <CompaniesCreatePage />
          </Route>
          <Route path="/company/:companyId" exact component={SingleCompanyPage} />

          {/* Contacts */}
          <Route path="/contact" exact>
            <ContactsPage />
          </Route>

          {/* Invoice */}
          <Route path="/invoice" exact>
            <InvoicesPage />
          </Route>

          <Route path="/company/:invoiceId" exact component={SingleInvoicePage} />
          {/* Contracts */}
          <Route path="/contract" exact>
            <ContractsPage />
          </Route>
          <Route path="/contract/new" exact>
            <ContractsPage />
            <ContractsCreatePage />
          </Route>
          <Route path="/contract/:contractId" exact component={SingleContractPage} />
        </Switch>
      </Container>

    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    authStatus: state.auth.authStatus,
    status: state.auth.status,
    profile: state.auth.profile,
    profileStatus: state.auth.profileStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Routes));
