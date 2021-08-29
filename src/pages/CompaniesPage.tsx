import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { Roles } from '../clients/server.generated';
import AuthorizationComponent from '../components/AuthorizationComponent';
import CompanyTable from '../components/entities/company/CompanyTable';
import CompanyTableControls from '../components/entities/company/CompanyTableControls';

function CompaniesPage(props: RouteComponentProps) {
  const { t } = useTranslation();

  return (
    <AuthorizationComponent
      roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]}
      notFound
    >
      <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="building" />
                <Header.Content>
                  <Header.Subheader>{t('entity.companies')}</Header.Subheader>
                  {t('pages.companies.subheader')}
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <AuthorizationComponent
                roles={[Roles.ADMIN]}
                notFound={false}
              >
                <Button icon labelPosition="left" primary floated="right" onClick={() => props.history.push('/company/new')}>
                  <Icon name="plus" />
                  {t('pages.companies.addCompany')}
                </Button>
              </AuthorizationComponent>
            </Grid.Column>
          </Grid>

          <CompanyTableControls />

        </Container>
      </Segment>
      <Container style={{ marginTop: '20px' }}>
        <CompanyTable />
      </Container>
    </AuthorizationComponent>
  );
}

export default withRouter(CompaniesPage);
