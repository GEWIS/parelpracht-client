import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Dispatch } from 'redux';
import {
  Dropdown, Icon, Loader, Menu,
} from 'semantic-ui-react';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';

interface Props {
}

function ProductsMenu(props: Props) {
  const [isOpen, changeOpen] = useState(false);

  return (
    <Menu.Menu>
      <Dropdown
        open={isOpen}
        onMouseEnter={() => changeOpen(true)}
        onMouseLeave={() => changeOpen(false)}
        item
        icon={null}
        as={NavLink}
        to="/product"
        text={(
          <>
            <Icon name="shopping bag" />
            Products
          </>
        ) as any}
      >
        <Dropdown.Menu>
          <Dropdown.Item as={NavLink} to="/category">
            Categories
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

export default ProductsMenu;
