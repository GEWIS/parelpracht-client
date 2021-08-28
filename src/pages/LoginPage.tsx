import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Container, Grid, Message, Segment, Image,
} from 'semantic-ui-react';
import './BackgroundAnimation.css';
import { useTranslation } from 'react-i18next';
import AlertContainer from '../components/alerts/AlertContainer';
import LoginForm from '../components/auth/LoginForm';
import ParelPrachtFullLogo from '../components/ParelPrachtFullLogo';

function LoginPage() {
  const { t } = useTranslation();
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
              <ParelPrachtFullLogo />
              <LoginForm />
            </Segment>
            <Message>
              {t('pages.login.troubleSigningIn')}
              {' '}
              <NavLink to="/forgot-password">{t('pages.login.forgotPassword')}</NavLink>
              .
            </Message>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
}

export default LoginPage;
