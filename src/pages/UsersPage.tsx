import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import UsersTable from '../components/user/UserTable';
import UserTableControls from '../components/user/UserTableControls';

function UsersPage(props: RouteComponentProps) {
  return (
    <>
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '2em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="users" />
                <Header.Content>
                  <Header.Subheader>Users</Header.Subheader>
                  All Users
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Button icon labelPosition="left" primary floated="right" onClick={() => props.history.push('/user/new')}>
                <Icon name="plus" />
                Add User
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
