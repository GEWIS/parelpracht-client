import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Container, Grid, Header, Message, Segment, Image,
} from 'semantic-ui-react';
import './LoginPage.css';
import AlertContainer from '../components/alerts/AlertContainer';
import LoginForm from '../components/auth/LoginForm';

function LoginPage() {
  return (
    <>
      <div className="bg" />
      <div className="bg bg2" />
      <div className="bg bg3" />
      <AlertContainer internal />
      <Container>
        <Grid textAlign="center" verticalAlign="middle" style={{ height: '100vh' }}>
          <Grid.Column width={6}>
            <Segment>
              <Image src="./gewis-logo.png" size="small" centered />
              <Header as="h1">
                ParelPracht
              </Header>
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
