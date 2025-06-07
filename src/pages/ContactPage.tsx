import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import {
  Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { Roles } from '../clients/server.generated';
import AuthorizationComponent from '../components/AuthorizationComponent';
import ContactsTable from '../components/entities/contact/ContactTable';
import ContactTableControls from '../components/entities/contact/ContactTableControls';
import { useTitle } from '../components/TitleContext';

function ContactsPage() {
  const { t } = useTranslation();
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle(t('entity.contacts'));
  }, [setTitle, t]);

  return (
    <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]} notFound>
      <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="address card" />
                <Header.Content>
                  <Header.Subheader>{t('entity.contacts')}</Header.Subheader>
                  {t('entities.contact.header')}
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid>

          <ContactTableControls />

        </Container>
      </Segment>
      <Container style={{ marginTop: '20px' }}>
        <ContactsTable />
      </Container>
    </AuthorizationComponent>
  );
}

export default ContactsPage;
