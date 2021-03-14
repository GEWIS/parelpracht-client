import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Dropdown, Icon, Menu,
} from 'semantic-ui-react';

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
          <Dropdown.Item as={NavLink} to="/category">
            <Icon name="tags" />
            Categories
          </Dropdown.Item>
          <Dropdown.Item as={NavLink} to="/directmail">
            <Icon name="mail" />
            Direct Mail
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

export default ProductsMenu;
