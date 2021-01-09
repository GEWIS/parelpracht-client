import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Icon, Menu } from 'semantic-ui-react';
import AuthMenu from './AuthMenu';

function Navigation() {
  return (
    <Menu fixed="top" inverted size="large">
      <Container>
        <Menu.Item as={NavLink} header to="/" exact>
          ParelPracht
        </Menu.Item>
        <Menu.Item as={NavLink} to="/product">
          <Icon name="shopping bag" />
          Products
        </Menu.Item>
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
        <AuthMenu />
      </Container>
    </Menu>
  );
}

export default Navigation;
