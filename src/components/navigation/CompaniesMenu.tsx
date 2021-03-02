import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Dropdown, Icon, Menu,
} from 'semantic-ui-react';

function CompaniesMenu() {
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
          <NavLink to="/company">
            <Icon name="building" />
            {' '}
            Companies
          </NavLink>
        ) as any}
      >
        <Dropdown.Menu>
          <Dropdown.Item as={NavLink} to="/contact">
            <Icon name="address card" />
            Contacts
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

export default CompaniesMenu;
