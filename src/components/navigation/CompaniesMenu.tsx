import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Dropdown, Icon, Menu,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

function CompaniesMenu() {
  const [isOpen, changeOpen] = useState(false);

  const { t } = useTranslation();

  return (
    <Menu.Menu>
      <Dropdown
        open={isOpen}
        onMouseEnter={() => changeOpen(true)}
        onMouseLeave={() => changeOpen(false)}
        item
        icon={null}
        trigger={(
          <NavLink to="/company" style={{ whiteSpace: 'nowrap' }}>
            <Icon name="building" />
            {' '}
            {t('mainMenu.companies')}
          </NavLink>
        ) as any}
      >
        <Dropdown.Menu>
          <Dropdown.Item as={NavLink} to="/contact">
            <Icon name="address card" />
            {t('mainMenu.contacts')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

export default CompaniesMenu;
