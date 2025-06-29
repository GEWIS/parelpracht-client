import { Navigate as Redirect, useRoutes, Outlet } from 'react-router-dom';
import { Container, Dimmer, Header, Loader } from 'semantic-ui-react';
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
import { AuthStatus, LoginMethods, Roles, User } from './clients/server.generated';
import LoginPage from './pages/LoginPage';
import SetupPage from './pages/SetupPage';
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
import { WithRouter, withRouter } from './WithRouter';

interface Props extends WithRouter {
  authStatus: AuthStatus | undefined;
  status: ResourceStatus;
  profile: User | undefined;
  loginMethod: LoginMethods;
  setupDone: boolean;

  hasRole: (role: Roles) => boolean;
}

function Routes(props: Props) {
  const { t } = useTranslation();

  const loginRoutes = [
    {
      path: '*',
      element: (
        <>
          <Redirect to="/login" />,
        </>
      ),
    },
    {
      path: '/login',
      element: (
        <>
          <LoginPage loginMethod={props.loginMethod} setupDone={props.setupDone} />
          <Footer />
        </>
      ),
    },
    {
      path: '*',
      element: (
        <>
          <LoginPage loginMethod={props.loginMethod} setupDone={props.setupDone} />
          <Footer />
        </>
      ),
    },
    {
      path: '/forgot-password',
      element: (
        <>
          <ForgotPasswordPage />
          <Footer />
        </>
      ),
    },
    {
      path: '/reset-password',
      element: (
        <>
          <ResetPasswordPage />
          <Footer />
        </>
      ),
    },
    {
      path: '/setup',
      element: (
        <>
          <SetupPage setupDone={props.setupDone} />
          <Footer />
        </>
      ),
    },
  ];

  if (props.loginMethod !== LoginMethods.Local) {
    loginRoutes.push({
      path: '/login/local',
      element: (
        <>
          <LoginPage loginMethod={LoginMethods.Local} setupDone={props.setupDone} />
          <Footer />
        </>
      ),
    });
  }

  const mainRoutes = [
    {
      path: '/login',
      element: <Redirect to="/" />,
    },
    {
      path: '/login/local',
      element: <Redirect to="/" />,
    },
    {
      path: '/setup',
      element: <Redirect to="/" />,
    },
    {
      path: '/',
      element: <DashboardPage />,
    },
    {
      path: '/norights',
      element: <NoRights />,
    },
    {
      path: '',
      element: <NotFound />,
    },
    {
      path: '/settings',
      element: (
        <>
          <AuthorizationComponent roles={[Roles.ADMIN]} notFound>
            <SettingsPage />
          </AuthorizationComponent>
        </>
      ),
    },
    /**
     * PRODUCT
     */
    {
      path: '/product',
      children: [
        {
          index: true,
          element: <ProductsPage />,
        },
        {
          path: 'new',
          element: (
            <>
              <AuthorizationComponent roles={[Roles.ADMIN, Roles.GENERAL]} notFound>
                <ProductsPage />
                <ProductCreatePage />
              </AuthorizationComponent>
            </>
          ),
        },
        {
          path: ':productId',
          element: <SingleProductPage />,
        },
        {
          path: ':productId/contract/new',
          element: (
            <>
              <AuthorizationComponent roles={[Roles.ADMIN, Roles.GENERAL]} notFound>
                <SingleProductPage />
                <ContractModal />
              </AuthorizationComponent>
            </>
          ),
        },
      ],
    },
    /**
     * PRODUCT CATEGORIES
     */
    {
      path: '/category',
      children: [
        {
          index: true,
          element: <ProductCategoriesPage />,
        },
        {
          path: 'new',
          element: (
            <>
              <AuthorizationComponent roles={[Roles.ADMIN]} notFound>
                <ProductCategoriesPage />
                <ProductCategoriesCreatePage />
              </AuthorizationComponent>
            </>
          ),
        },
        {
          path: ':categoryId',
          element: (
            <>
              <AuthorizationComponent roles={[Roles.ADMIN, Roles.GENERAL]} notFound>
                <ProductCategoriesPage />
                <ProductCategoryModal />
              </AuthorizationComponent>
            </>
          ),
        },
      ],
    },
    /**
     * COMPANY
     */
    {
      path: '/company',
      children: [
        {
          index: true,
          element: <CompaniesPage />,
        },
        {
          path: 'new',
          element: (
            <>
              <AuthorizationComponent roles={[Roles.ADMIN]} notFound>
                <CompaniesPage />
                <CompaniesCreatePage />
              </AuthorizationComponent>
            </>
          ),
        },
        {
          path: ':companyId',
          element: <SingleCompanyPage />,
        },
        {
          path: ':companyId/contact/new',
          element: (
            <>
              <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
                <SingleCompanyPage />
                <ContactModal create onCompanyPage />
              </AuthorizationComponent>
            </>
          ),
        },
        {
          path: ':companyId/contact/:contactId',
          element: (
            <>
              <SingleCompanyPage />
              <ContactModal onCompanyPage />
            </>
          ),
        },
        {
          path: ':companyId/contract/new',
          element: (
            <>
              <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
                <SingleCompanyPage />
                <ContractModal />
              </AuthorizationComponent>
            </>
          ),
        },
      ],
    },
    /**
     * CONTACTS
     */
    {
      path: '/contact',
      children: [
        {
          index: true,
          element: <ContactsPage />,
        },
        {
          path: ':contactId',
          element: (
            <>
              <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]} notFound>
                <ContactsPage />
                <ContactModal onCompanyPage={false} />
              </AuthorizationComponent>
            </>
          ),
        },
      ],
    },
    /**
     * INVOICES
     */
    {
      path: '/invoice',
      children: [
        {
          index: true,
          element: <InvoicesPage />,
        },
        {
          path: 'custom',
          element: <CustomInvoicePage />,
        },
        {
          path: ':invoiceId',
          element: <SingleInvoicePage />,
        },
      ],
    },
    /**
     * CONTRACTS
     */
    {
      path: '/contract',
      children: [
        {
          index: true,
          element: <ContractsPage />,
        },
        {
          path: 'new',
          element: (
            <>
              <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
                <ContractsPage />
                <ContractModal />
              </AuthorizationComponent>
            </>
          ),
        },
        {
          path: ':contractId',
          element: <SingleContractPage />,
        },
        {
          path: ':contractId/product/new',
          element: (
            <>
              <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
                <SingleContractPage />
                <ContractProductInstanceModal create />
              </AuthorizationComponent>
            </>
          ),
        },
        {
          path: ':contractId/product/:productInstanceId',
          element: (
            <>
              <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]} notFound={false}>
                <SingleContractPage />
                <ContractProductInstanceModal />
              </AuthorizationComponent>
            </>
          ),
        },
      ],
    },
    /**
     * INSIGHTS
     */
    {
      path: '/insights',
      element: <Insights />,
    },
    /**
     * USERS
     */
    {
      path: 'user/:userId',
      element: <SingleUserPage />,
    },
  ];

  if (props.hasRole(Roles.ADMIN)) {
    mainRoutes.push({
      path: '/users',
      children: [
        {
          index: true,
          element: <UsersPage />,
        },
        {
          path: '/users/new',
          element: (
            <>
              <UsersPage />
              <UserCreatePage />
            </>
          ),
        },
      ],
    });
  }

  const routes = useRoutes(!props.authStatus || !props.authStatus.authenticated ? loginRoutes : mainRoutes);
  const loader = (
    <Container>
      <Dimmer active page inverted>
        <Header as="h2" icon>
          <Loader inline content={<ParelPrachtFullLogo />} size="large" />
          <Header.Subheader>{t('pages.loading')}</Header.Subheader>
        </Header>
      </Dimmer>
    </Container>
  );

  if (props.status !== ResourceStatus.FETCHED || props.authStatus === undefined) {
    return loader;
  }

  if (!props.authStatus.authenticated) {
    return routes;
  }

  if (props.profile === undefined) {
    return loader;
  }

  const mainStyle =
    props.profile.backgroundFilename === ''
      ? {
          backgroundColor: 'white',
        }
      : {
          width: '100vw',
          backgroundImage: `url("/static/backgrounds/${props.profile.backgroundFilename}`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
        };

  return (
    <div>
      <Navigation />
      <Container className="main" fluid style={mainStyle}>
        <AlertContainer internal />
        {routes}

        <Outlet />
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
    setupDone: state.general.setupDone,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Routes));
