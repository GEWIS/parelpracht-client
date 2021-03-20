import * as React from 'react';
import {
  Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { Roles } from '../clients/server.generated';
import AuthorizationComponent from '../components/AuthorizationComponent';
import ContactsTable from '../components/contact/ContactTable';
import ContactTableControls from '../components/contact/ContactTableControls';

function ContactsPage() {
  return (
    <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]} notFound>
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '2em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="address card" />
                <Header.Content>
                  <Header.Subheader>Contacts</Header.Subheader>
                  All Contacts
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid>

          <ContactTableControls />

        </Container>
      </Segment>
      <Container>
        <ContactsTable />
      </Container>
    </AuthorizationComponent>
  );
}

export default ContactsPage;
