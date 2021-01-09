import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Container, Grid, Header, Message, Segment,
} from 'semantic-ui-react';
import AlertContainer from '../components/alerts/AlertContainer';
import LoginForm from '../components/auth/LoginForm';

function LoginPage() {
  return (
    <>
      <AlertContainer internal />
      <Container>
        <Grid textAlign="center" verticalAlign="middle" style={{ height: '100vh' }}>
          <Grid.Column width={6}>
            <Header as="h1">
              ParelPracht
            </Header>
            <Segment>
              <LoginForm />
            </Segment>
            <Message>
              Trouble signing in?
              {' '}
              <NavLink to="/forgot-password">Forgot password</NavLink>
              .
            </Message>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
}

export default LoginPage;
