import * as React from 'react';
import {
  withRouter, Switch, Route, RouteComponentProps, Redirect,
} from 'react-router-dom';
import {
  Container, Dimmer, Header, Loader,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
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
import ContractCreatePage from './pages/ContractCreatePage';
import Navigation from './components/navigation/Navigation';
import { RootState } from './stores/store';
import ResourceStatus from './stores/resourceStatus';
import { AuthStatus } from './clients/server.generated';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ContactModal from './pages/ContactModal';
import UsersPage from './pages/UsersPage';
import SingleUserPage from './pages/SingleUserPage';
import UserCreatePage from './pages/UserCreatePage';

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
    const authPaths = ['/login', '/forgot-password', '/reset-password'];
    const onAuthPath = authPaths.find(
      (p) => props.location.pathname === p,
    ) !== undefined;

    if (!onAuthPath) {
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
          <Route path="/product/:productId/contract/new" exact>
            <SingleProductPage />
            <ContractCreatePage />
          </Route>
          {/* Company */}
          <Route path="/company" exact>
            <CompaniesPage />
          </Route>
          <Route path="/company/new" exact>
            <CompaniesPage />
            <CompaniesCreatePage />
          </Route>
          <Route path="/company/:companyId" exact component={SingleCompanyPage} />
          <Route path="/company/:companyId/contact/new" exact>
            <SingleCompanyPage />
            <ContactModal create />
          </Route>
          <Route path="/company/:companyId/contact/:contactId" exact>
            <SingleCompanyPage />
            <ContactModal />
          </Route>
          <Route path="/company/:companyId/contract/new" exact>
            <SingleCompanyPage />
            <ContractCreatePage />
          </Route>

          {/* Contacts */}
          <Route path="/contact" exact>
            <ContactsPage />
          </Route>
          <Route path="/contact/:contactId" exact>
            <ContactsPage />
            <ContactModal />
          </Route>

          {/* Invoice */}
          <Route path="/invoice" exact>
            <InvoicesPage />
          </Route>
          <Route path="/invoice/:invoiceId" exact component={SingleInvoicePage} />

          {/* Contracts */}
          <Route path="/contract" exact>
            <ContractsPage />
          </Route>
          <Route path="/contract/new" exact>
            <ContractsPage />
            <ContractCreatePage />
          </Route>
          <Route path="/contract/:contractId" exact component={SingleContractPage} />
          {/* Users */}
          <Route path="/user" exact>
            <UsersPage />
          </Route>
          <Route path="/user/new" exact>
            <UsersPage />
            <UserCreatePage />
          </Route>
          <Route path="/user/:userId" exact component={SingleUserPage} />
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

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Routes));
