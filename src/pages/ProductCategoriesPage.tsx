import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { Roles } from '../clients/server.generated';
import AuthorizationComponent from '../components/AuthorizationComponent';
import ProductCategoriesTable from '../components/entities/productcategories/ProductCategoriesTable';
import ProductCategoriesTableControls from '../components/entities/productcategories/ProductCategoriesTableControls';

function ProductCategoriesPage(props: RouteComponentProps) {
  const { t } = useTranslation();
  return (
    <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
      <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="shopping bag" />
                <Header.Content>
                  <Header.Subheader>{t('entity.categories')}</Header.Subheader>
                  {t('categories.header')}
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <AuthorizationComponent roles={[Roles.ADMIN]} notFound={false}>
                <Button icon labelPosition="left" primary floated="right" onClick={() => props.history.push('/category/new')}>
                  <Icon name="plus" />
                  {t('categories.addCategory')}
                </Button>
              </AuthorizationComponent>
            </Grid.Column>
          </Grid>

          <ProductCategoriesTableControls />

        </Container>
      </Segment>
      <Container style={{ marginTop: '20px' }}>
        <ProductCategoriesTable />
      </Container>
    </AuthorizationComponent>
  );
}

export default withRouter(ProductCategoriesPage);
