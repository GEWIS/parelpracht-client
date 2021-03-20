import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Dropdown, Icon, Menu,
} from 'semantic-ui-react';
import { Roles } from '../../clients/server.generated';
import AuthorizationComponent from '../AuthorizationComponent';

function ProductsMenu() {
  const [isOpen, changeOpen] = useState(false);

  return (
    <Menu.Menu>
      <Dropdown
        open={isOpen}
        onMouseEnter={() => changeOpen(true)}
        onMouseLeave={() => changeOpen(false)}
        item
        icon={null}
        trigger={(
          <NavLink to="/product">
            <Icon name="shopping bag" />
            {' '}
            Products
          </NavLink>
        ) as any}
      >
        <Dropdown.Menu>
          <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
            <Dropdown.Item as={NavLink} to="/category">
              <Icon name="tags" />
              Categories
            </Dropdown.Item>
          </AuthorizationComponent>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

export default ProductsMenu;
