import { useEffect } from 'react';
import { Navigate as Redirect, NavLink } from 'react-router-dom';
import { Container, Image, Message, Segment } from 'semantic-ui-react';
import './BackgroundAnimation.css';
import { useTranslation } from 'react-i18next';
import AlertContainer from '../components/alerts/AlertContainer';
import LoginLocalForm from '../components/auth/LoginLocalForm';
import LoginLDAPForm from '../components/auth/LoginLDAPForm';
import ParelPrachtFullLogo from '../components/ParelPrachtFullLogo';
import CenterInPage from '../components/CenterInPage';
import { useTitle } from '../components/TitleContext';
import { LoginMethods } from '../clients/generated-client-new';

interface Props {
  loginMethod: LoginMethods;
  setupDone: boolean;
}

function LoginPage({ loginMethod, setupDone }: Props) {
  const { t } = useTranslation();
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle(t('pages.login.title'));
  }, [setTitle, t]);

  let loginForm;
  switch (loginMethod) {
    case LoginMethods.LOCAL:
      loginForm = <LoginLocalForm />;
      break;
    case LoginMethods.LDAP:
      loginForm = <LoginLDAPForm />;
      break;
    default:
      throw new Error(`Unknown login method: ${loginMethod as string}`);
  }

  if (!setupDone) {
    return (
      <>
        <Redirect to={'/setup'} />
      </>
    );
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
          {loginMethod === LoginMethods.LOCAL ? (
            <Message>
              {t('pages.login.troubleSigningIn')}{' '}
              <NavLink to="/forgot-password">{t('pages.login.forgotPassword')}</NavLink>.
            </Message>
          ) : null}
          {loginMethod !== LoginMethods.LOCAL ? (
            <Message>
              <NavLink to="/login/local">{t('pages.login.localLoginInstead')}</NavLink>
            </Message>
          ) : null}
        </CenterInPage>
      </Container>
    </>
  );
}

export default LoginPage;
