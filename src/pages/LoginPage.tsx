import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Container, Message, Segment, Image,
} from 'semantic-ui-react';
import './BackgroundAnimation.css';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import AlertContainer from '../components/alerts/AlertContainer';
import LoginLocalForm from '../components/auth/LoginLocalForm';
import LoginLDAPForm from '../components/auth/LoginLDAPForm';
import ParelPrachtFullLogo from '../components/ParelPrachtFullLogo';
import { RootState } from '../stores/store';
import { LoginMethods } from '../clients/server.generated';
import CenterInPage from '../components/CenterInPage';

interface Props {
  loginMethod: LoginMethods;
}

function LoginPage({ loginMethod }: Props) {
  const { t } = useTranslation();

  let loginForm;
  switch (loginMethod) {
    case LoginMethods.Local:
      loginForm = <LoginLocalForm />; break;
    case LoginMethods.Ldap:
      loginForm = <LoginLDAPForm />; break;
    default:
      throw new Error(`Unknown login method: ${loginMethod}`);
  }

  return (
    <>
      <div className="bg" />
      <div className="bg bg2" />
      <div className="bg bg3" />
      <AlertContainer internal />
      <Container>
        <CenterInPage>
          <Segment>
            <Image src="./gewis-logo.png" size="small" centered />
            <ParelPrachtFullLogo />
            {loginForm}
          </Segment>
          {loginMethod === LoginMethods.Local ? (
            <Message>
              {t('pages.login.troubleSigningIn')}
              {' '}
              <NavLink to="/forgot-password">{t('pages.login.forgotPassword')}</NavLink>
              .
            </Message>
          ) : null}
        </CenterInPage>
      </Container>
    </>
  );
}

const mapStateToProps = (state: RootState) => ({
  loginMethod: state.general.loginMethod,
});

export default connect(mapStateToProps)(LoginPage);
