import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown, Icon, Menu } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Roles } from '../../clients/server.generated';
import AuthorizationComponent from '../AuthorizationComponent';

function InvoicesMenu() {
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
        trigger={
          <NavLink to="/invoice" title={t('mainMenu.invoices')}>
            <Icon name="money bill alternate outline" />
            <span> {t('mainMenu.invoices')}</span>
          </NavLink>
        }
      >
        <Dropdown.Menu>
          <AuthorizationComponent roles={[Roles.FINANCIAL, Roles.ADMIN]} notFound={false}>
            <Dropdown.Item as={NavLink} to="/invoice/custom">
              <Icon name="credit card" />
              {t('mainMenu.custom')}
            </Dropdown.Item>
          </AuthorizationComponent>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

export default InvoicesMenu;
