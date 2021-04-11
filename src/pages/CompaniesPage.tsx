import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { Roles } from '../clients/server.generated';
import AuthorizationComponent from '../components/AuthorizationComponent';
import CompanyTable from '../components/company/CompanyTable';
import CompanyTableControls from '../components/company/CompanyTableControls';

function CompaniesPage(props: RouteComponentProps) {
  return (
    <AuthorizationComponent
      roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]}
      notFound
    >
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '2em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="building" />
                <Header.Content>
                  <Header.Subheader>Companies</Header.Subheader>
                  All Companies
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
                  Add Company
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
