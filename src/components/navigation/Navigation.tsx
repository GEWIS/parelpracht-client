import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Icon, Menu } from 'semantic-ui-react';
import AuthMenu from './AuthMenu';
import ProductsMenu from './ProductsMenu';

function Navigation() {
  return (
    <Menu fixed="top" inverted size="large" className="main-menu">
      <Container>
        <Menu.Item as={NavLink} header to="/" exact>
          ParelPracht
        </Menu.Item>
        <ProductsMenu />
        <Menu.Item as={NavLink} to="/company">
          <Icon name="building" />
          Companies
        </Menu.Item>
        <Menu.Item as={NavLink} to="/contract">
          <Icon name="file alternate" />
          Contracts
        </Menu.Item>
        <Menu.Item as={NavLink} to="/contact">
          <Icon name="address book" />
          Contacts
        </Menu.Item>
        <Menu.Item as={NavLink} to="/invoice">
          <Icon name="file alternate" />
          Invoices
        </Menu.Item>
        <Menu.Item as={NavLink} to="/insights">
          <Icon name="line graph" />
          Insights
        </Menu.Item>
        <AuthMenu />
      </Container>
    </Menu>
  );
}

export default Navigation;
