import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { useTranslation, withTranslation } from 'react-i18next';
import { Roles } from '../clients/server.generated';
import AuthorizationComponent from '../components/AuthorizationComponent';
import ProductsTable from '../components/entities/product/ProductTable';
import ProductTableControls from '../components/entities/product/ProductTableControls';
import { useTitle } from '../components/TitleContext';
import { withRouter } from '../WithRouter';

function ProductsPage() {
  const { t } = useTranslation();
  const { setTitle } = useTitle();

  React.useEffect(() => {
    setTitle(t('entity.products'));
  }, [setTitle, t]);

  const history = useNavigate();

  return (
    <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound>
      <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="shopping bag" />
                <Header.Content>
                  <Header.Subheader>
                    {t('pages.products.header')}
                  </Header.Subheader>
                  {t('pages.products.subheader')}
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <AuthorizationComponent roles={[Roles.ADMIN]} notFound={false}>
                <Button icon labelPosition="left" primary floated="right" onClick={() => history('/product/new')}>
                  <Icon name="plus" />
                  {t('pages.products.addProduct')}
                </Button>
              </AuthorizationComponent>
            </Grid.Column>
          </Grid>

          <ProductTableControls />

        </Container>
      </Segment>
      <Container style={{ marginTop: '20px' }}>
        <ProductsTable />
      </Container>
    </AuthorizationComponent>
  );
}

export default withTranslation()(withRouter(ProductsPage));
