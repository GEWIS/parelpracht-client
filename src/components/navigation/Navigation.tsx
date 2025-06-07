import { NavLink } from 'react-router-dom';
import { Container, Icon, Menu, Image } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import AuthorizationComponent from '../AuthorizationComponent';
import { Roles } from '../../clients/server.generated';
import AuthMenu from './AuthMenu';
import CompaniesMenu from './CompaniesMenu';
import ProductsMenu from './ProductsMenu';
import InvoicesMenu from './InvoicesMenu';
import './Navigation.scss';

function Navigation() {
  const { t } = useTranslation();

  return (
    <Menu fixed="top" inverted size="large" className="main-menu">
      <Container>
        <Menu.Item as={NavLink} header to="/" title="Home">
          <Image
            className="logo"
            src="/ParelPracht-whitesvg.svg"
            width="26px"
            style={{
              marginBottom: '-6px',
              marginTop: '-10px',
              marginRight: '0px',
              paddingRight: '0px',
            }}
          />
        </Menu.Item>
        <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
          <ProductsMenu />
        </AuthorizationComponent>
        <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT, Roles.FINANCIAL]} notFound={false}>
          <CompaniesMenu />
        </AuthorizationComponent>
        <Menu.Item as={NavLink} to="/contract" title={t('mainMenu.contracts')}>
          <Icon name="file alternate" />
          <span>{t('mainMenu.contracts')}</span>
        </Menu.Item>
        <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT, Roles.FINANCIAL]} notFound={false}>
          <InvoicesMenu />
        </AuthorizationComponent>
        <Menu.Item as={NavLink} to="/insights" title={t('mainMenu.insights')}>
          <Icon name="line graph" />
          <span>{t('mainMenu.insights')}</span>
        </Menu.Item>
        <AuthMenu />
      </Container>
    </Menu>
  );
}

export default Navigation;
