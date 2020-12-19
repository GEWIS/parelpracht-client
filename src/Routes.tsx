import * as React from 'react';
import {
  withRouter, Switch, Route, NavLink,
} from 'react-router-dom';
import { Container, Icon, Menu } from 'semantic-ui-react';
import ProductsPage from './pages/ProductsPage';
import SingleProductPage from './pages/SingleProductPage';
/* import SingleProductPage from './pages/SingleProductPage'; */

function Routes() {
  return (
    <div>
      {/* TODO: Refactor menu */}
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item as={NavLink} header to="/" exact>
            CRM
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
        </Container>
      </Menu>

      <Switch>
        <Route path="/product" exact>
          <ProductsPage />
        </Route>
        <Route path="/product/:productId" exact component={SingleProductPage} />
      </Switch>
    </div>
  );
}
const routesWithRouter = withRouter(Routes);
export { routesWithRouter as Routes };
