import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Dropdown, Icon, Menu,
} from 'semantic-ui-react';

function InvoicesMenu() {
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
          <NavLink to="/invoice">
            <Icon name="money bill alternate outline" />
            Products
          </NavLink>
        ) as any}
      >
        <Dropdown.Menu>
          <Dropdown.Item as={NavLink} to="/invoice/custom">
            <Icon name="credit card" />
            Custom
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

export default InvoicesMenu;
