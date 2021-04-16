import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Container, Icon, Menu, Image,
} from 'semantic-ui-react';
import AuthMenu from './AuthMenu';
import CompaniesMenu from './CompaniesMenu';
import ProductsMenu from './ProductsMenu';
import InvoicesMenu from './InvoicesMenu';
import AuthorizationComponent from '../AuthorizationComponent';
import { Roles } from '../../clients/server.generated';

function Navigation() {
  return (
    <Menu fixed="top" inverted size="large" className="main-menu">
      <Container>
        <Menu.Item as={NavLink} header to="/" exact>
          <Image
            src="/ParelPracht-whitesvg.svg"
            width="26px"
            style={{
              marginBottom: '-6px', marginTop: '-10px', marginRight: '0px', paddingRight: '0px',
            }}
          />
        </Menu.Item>
        <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
          <ProductsMenu />
        </AuthorizationComponent>
        <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]} notFound={false}>
          <CompaniesMenu />
        </AuthorizationComponent>
        <Menu.Item as={NavLink} to="/contract" style={{ whiteSpace: 'nowrap' }}>
          <Icon name="file alternate" />
          Contracts
        </Menu.Item>
        <AuthorizationComponent
          roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT, Roles.FINANCIAL]}
          notFound={false}
        >
          <InvoicesMenu />
        </AuthorizationComponent>
        <Menu.Item as={NavLink} to="/insights" style={{ whiteSpace: 'nowrap' }}>
          <Icon name="line graph" />
          Insights
        </Menu.Item>
        <AuthMenu />
      </Container>
    </Menu>
  );
}

export default Navigation;
