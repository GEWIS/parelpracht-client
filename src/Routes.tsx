import * as React from 'react';
import {
  Redirect, Route, RouteComponentProps, Switch, withRouter,
} from 'react-router-dom';
import {
  Container, Dimmer, Header, Loader,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
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
import ContractModal from './pages/ContractModal';
import Navigation from './components/navigation/Navigation';
import { RootState } from './stores/store';
import ResourceStatus from './stores/resourceStatus';
import { AuthStatus, Roles, User } from './clients/server.generated';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ContactModal from './pages/ContactModal';
import UsersPage from './pages/UsersPage';
import SingleUserPage from './pages/SingleUserPage';
import UserCreatePage from './pages/UserCreatePage';
import ContractProductInstanceModal from './pages/ContractProductInstanceModal';
import InvoiceProductInstanceModal from './pages/InvoiceProductInstanceModal';
import Footer from './components/navigation/Footer';
import DashboardPage from './pages/DashboardPage';
import NotFound from './pages/NotFound';
import Insights from './pages/Insights';
import ProductCategoriesPage from './pages/ProductCategoriesPage';
import ProductCategoriesCreatePage from './pages/ProductCategoriesCreatePage';
import ProductCategoryModal from './pages/ProductCategoryModal';
import CustomInvoicePage from './pages/CustomInvoicePage';
import { authedUserHasRole } from './stores/auth/selectors';
import AuthorizationComponent from './components/AuthorizationComponent';

interface Props extends RouteComponentProps {
  // eslint-disable-next-line react/no-unused-prop-types
  authStatus: AuthStatus | undefined;
  status: ResourceStatus;
  profile: User | undefined;

  hasRole: (role: Roles) => boolean;
}

function Routes(props: Props) {
  const loader = (
    <Container>
      <Dimmer active page inverted>

        <Header as="h2" icon>
          <Loader inline content="ParelPracht" size="large" />
          <Header.Subheader>Checking login information...</Header.Subheader>
        </Header>
      </Dimmer>
    </Container>
  );

  if (props.status !== ResourceStatus.FETCHED || props.authStatus === undefined) {
    return loader;
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
          <Footer />
        </Route>
        <Route path="/forgot-password" exact>
          <ForgotPasswordPage />
          <Footer />
        </Route>
        <Route path="/reset-password" exact>
          <ResetPasswordPage />
          <Footer />
        </Route>
      </Switch>
    );
  }

  if (props.profile === undefined) return loader;

  return (
    <div>
      <Navigation />
      <Container
        className="main"
        fluid
      >
        <AlertContainer internal />
        <Switch>
          <Route path="/login" exact>
            <Redirect to="/" />
          </Route>
          <Route path="/" exact>
            <DashboardPage />
          </Route>
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
            <ContractModal />
          </Route>
          {/* Product Categories */}
          <Route path="/category" exact>
            <ProductCategoriesPage />
          </Route>
          <Route path="/category/new" exact>
            <ProductCategoriesPage />
            <ProductCategoriesCreatePage />
          </Route>
          <Route path="/category/:categoryId" exact>
            <ProductCategoriesPage />
            <ProductCategoryModal />
          </Route>
          {/* Company */}
          <Route path="/company" exact>
            <CompaniesPage />
          </Route>
          <Route path="/company/new" exact>
            <AuthorizationComponent roles={[Roles.ADMIN]} notFound>
              <CompaniesPage />
              <CompaniesCreatePage />
            </AuthorizationComponent>
          </Route>
          <Route path="/company/:companyId" exact component={SingleCompanyPage} />
          <Route path="/company/:companyId/contact/new" exact>
            <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
              <SingleCompanyPage />
              <ContactModal create onCompanyPage />
            </AuthorizationComponent>
          </Route>
          <Route path="/company/:companyId/contact/:contactId" exact>
            <SingleCompanyPage />
            <ContactModal onCompanyPage />
          </Route>
          <Route path="/company/:companyId/contract/new" exact>
            <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
              <SingleCompanyPage />
              <ContractModal />
            </AuthorizationComponent>
          </Route>

          {/* Contacts */}
          <Route path="/contact" exact>
            <ContactsPage />
          </Route>
          <Route path="/contact/:contactId" exact>
            <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]} notFound>
              <ContactsPage />
              <ContactModal onCompanyPage={false} />
            </AuthorizationComponent>
          </Route>

          {/* Invoice */}
          <Route path="/invoice" exact>
            <InvoicesPage />
          </Route>
          <Route path="/invoice/custom" exact>
            <CustomInvoicePage />
          </Route>
          <Route path="/invoice/:invoiceId" exact component={SingleInvoicePage} />
          <Route path="/invoice/:invoiceId/product/:productInstanceId" exact>
            <SingleInvoicePage />
            <InvoiceProductInstanceModal />
          </Route>

          {/* Contracts */}
          <Route path="/contract" exact>
            <ContractsPage />
          </Route>
          <Route path="/contract/new" exact>
            <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
              <ContractsPage />
              <ContractModal />
            </AuthorizationComponent>
          </Route>
          <Route path="/contract/:contractId" exact component={SingleContractPage} />
          <Route path="/contract/:contractId/product/new" exact>
            <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
              <SingleContractPage />
              <ContractProductInstanceModal create />
            </AuthorizationComponent>
          </Route>
          <Route path="/contract/:contractId/product/:productInstanceId" exact>
            <AuthorizationComponent
              roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]}
              notFound={false}
            >
              <SingleContractPage />
              <ContractProductInstanceModal />
            </AuthorizationComponent>
          </Route>

          {/* Insights */}
          <Route path="/insights" exact>
            <Insights />
          </Route>

          {/* Users */}
          {props.hasRole(Roles.ADMIN) ? [
            <Route path="/user" exact>
              <UsersPage />
            </Route>,
            <Route path="/user/new" exact>
              <UsersPage />
              <UserCreatePage />
            </Route>,
          ] : null}
          <Route path="/user/:userId" exact component={SingleUserPage} />
          <Route path="" component={NotFound} />
        </Switch>
      </Container>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    authStatus: state.auth.authStatus,
    status: state.auth.status,
    profile: state.auth.profile,
    profileStatus: state.auth.profileStatus,
    hasRole: (role: Roles): boolean => authedUserHasRole(state, role),
  };
};

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Routes));
