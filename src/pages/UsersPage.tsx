import * as React from 'react';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import UsersTable from '../components/entities/user/UserTable';
import UserTableControls from '../components/entities/user/UserTableControls';
import { useTitle } from '../components/TitleContext';
import { withRouter, WithRouter } from '../WithRouter';

function UsersPage(props: WithRouter) {
  const { t } = useTranslation();
  const { setTitle } = useTitle();
  const { navigate } = props.router;

  React.useEffect(() => {
    setTitle(t('entity.users'));
  }, [setTitle, t]);

  return (
    <>
      <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="users" />
                <Header.Content>
                  <Header.Subheader>{t('entity.users')}</Header.Subheader>
                  {t('pages.users.allUsers')}
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Button icon labelPosition="left" primary floated="right" onClick={() => navigate('/users/new')}>
                <Icon name="plus" />
                {t('pages.users.addUser')}
              </Button>
            </Grid.Column>
          </Grid>

          <UserTableControls />

        </Container>
      </Segment>
      <Container style={{ marginTop: '20px' }}>
        <UsersTable />
      </Container>
    </>
  );
}

export default withRouter(UsersPage);
