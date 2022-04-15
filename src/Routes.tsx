import * as React from 'react';
import {
  Redirect, Route, RouteComponentProps, Switch, withRouter,
} from 'react-router-dom';
import {
  Container, Dimmer, Header, Loader,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
import ContractsPage from './pages/ContractsPage';
import SingleContractPage from './pages/SingleContractPage';
import ContractModal from './pages/ContractModal';
import Navigation from './components/navigation/Navigation';
import { RootState } from './stores/store';
import ResourceStatus from './stores/resourceStatus';
import {
  AuthStatus, LoginMethods, Roles, User,
} from './clients/server.generated';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ContactModal from './pages/ContactModal';
import UsersPage from './pages/UsersPage';
import SingleUserPage from './pages/SingleUserPage';
import UserCreatePage from './pages/UserCreatePage';
import ContractProductInstanceModal from './pages/ContractProductInstanceModal';
import Footer from './components/navigation/Footer';
import DashboardPage from './pages/DashboardPage';
import NotFound from './pages/NotFound';
import NoRights from './pages/NoRights';
import Insights from './pages/Insights';
import ProductCategoriesPage from './pages/ProductCategoriesPage';
import ProductCategoriesCreatePage from './pages/ProductCategoriesCreatePage';
import ProductCategoryModal from './pages/ProductCategoryModal';
import CustomInvoicePage from './pages/CustomInvoicePage';
import { authedUserHasRole } from './stores/auth/selectors';
import AuthorizationComponent from './components/AuthorizationComponent';
import ParelPrachtFullLogo from './components/ParelPrachtFullLogo';
import SettingsPage from './pages/SettingsPage';

interface Props extends RouteComponentProps {
  // eslint-disable-next-line react/no-unused-prop-types
  authStatus: AuthStatus | undefined;
  status: ResourceStatus;
  profile: User | undefined;
  loginMethod: LoginMethods;

  hasRole: (role: Roles) => boolean;
}

function Routes(props: Props) {
  const { t } = useTranslation();
  const loader = (
    <Container>
      <Dimmer active page inverted>

        <Header as="h2" icon>
          <Loader
            inline
            content={(<ParelPrachtFullLogo />)}
            size="large"
          />
          <Header.Subheader>{t('pages.loading')}</Header.Subheader>
        </Header>
      </Dimmer>
    </Container>
  );

  if (props.status !== ResourceStatus.FETCHED || props.authStatus === undefined) {
    return loader;
  }

  if (!props.authStatus.authenticated) {
    const authPaths = ['/login', '/forgot-password', '/reset-password'];
    if (props.loginMethod !== LoginMethods.Local) authPaths.push('/login/local');

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
          <LoginPage loginMethod={props.loginMethod} />
          <Footer />
        </Route>
        {authPaths.includes('/login/local') ? (
          <Route path="/login/local" exact>
            <LoginPage loginMethod={LoginMethods.Local} />
            <Footer />
          </Route>
        ) : null}
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
  const mainStyle = props.profile.backgroundFilename === '' ? (
    {
      backgroundColor: 'white',
    }
  ) : (
    {
      width: '100vw',
      backgroundImage: `url("/static/backgrounds/${props.profile.backgroundFilename}`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    }
  );

  return (
    <div>
      <Navigation />
      <Container
        className="main"
        fluid
        style={mainStyle}
      >
        <AlertContainer internal />
        <Switch>
          <Route path="/login" exact>
            <Redirect to="/" />
          </Route>
          <Route path="/login/local" exact>
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
            <AuthorizationComponent roles={[Roles.ADMIN, Roles.GENERAL]} notFound>
              <ProductsPage />
              <ProductCreatePage />
            </AuthorizationComponent>
          </Route>
          <Route path="/product/:productId" exact component={SingleProductPage} />
          <Route path="/product/:productId/contract/new" exact>
            <AuthorizationComponent roles={[Roles.ADMIN, Roles.GENERAL]} notFound>
              <SingleProductPage />
              <ContractModal />
            </AuthorizationComponent>
          </Route>
          {/* Product Categories */}
          <Route path="/category" exact>
            <ProductCategoriesPage />
          </Route>
          <Route path="/category/new" exact>
            <AuthorizationComponent roles={[Roles.ADMIN]} notFound>
              <ProductCategoriesPage />
              <ProductCategoriesCreatePage />
            </AuthorizationComponent>
          </Route>
          <Route path="/category/:categoryId" exact>
            <AuthorizationComponent roles={[Roles.ADMIN, Roles.GENERAL]} notFound>
              <ProductCategoriesPage />
              <ProductCategoryModal />
            </AuthorizationComponent>
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

          {/* Contracts */}
          <Route path="/contract" exact>
            <ContractsPage />
          </Route>
          <Route path="/contract/new" exact>
            <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
              <ContractsPage />
              <ContractModal />
            </AuthorizationComponent>
          </Route>
          <Route path="/contract/:contractId" exact component={SingleContractPage} />
          <Route path="/contract/:contractId/product/new" exact>
            <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
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
            <Route path="/users" exact key="1">
              <UsersPage />
            </Route>,
            <Route path="/user/new" exact key="2">
              <UsersPage />
              <UserCreatePage />
            </Route>,
          ] : null}
          <Route path="/user/:userId" exact component={SingleUserPage} />

          <AuthorizationComponent roles={[Roles.ADMIN]} notFound>
            <Route path="/settings" exact component={SettingsPage} />
          </AuthorizationComponent>

          <Route path="/norights" component={NoRights} />
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
    loginMethod: state.general.loginMethod,
  };
};

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Routes));
