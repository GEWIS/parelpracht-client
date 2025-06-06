import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Dropdown, Icon, Menu,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Roles } from '../../clients/server.generated';
import AuthorizationComponent from '../AuthorizationComponent';

function ProductsMenu() {
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
          <NavLink to="/product" title={t('mainMenu.products')}>
            <Icon name="shopping bag" />
            <span>
              {' '}
              {t('mainMenu.products')}
            </span>
          </NavLink>
        )}
      >
        <Dropdown.Menu>
          <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
            <Dropdown.Item as={NavLink} to="/category">
              <Icon name="tags" />
              {t('mainMenu.categories')}
            </Dropdown.Item>
          </AuthorizationComponent>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

export default ProductsMenu;
