import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Dropdown, Icon, Menu,
} from 'semantic-ui-react';
import { Roles } from '../../clients/server.generated';
import AuthorizationComponent from '../AuthorizationComponent';

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
            {' '}
            Invoices
          </NavLink>
        ) as any}
      >

        <Dropdown.Menu>
          <AuthorizationComponent roles={[Roles.FINANCIAL, Roles.ADMIN]} notFound={false}>
            <Dropdown.Item as={NavLink} to="/invoice/custom">
              <Icon name="credit card" />
              Custom
            </Dropdown.Item>
          </AuthorizationComponent>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

export default InvoicesMenu;
