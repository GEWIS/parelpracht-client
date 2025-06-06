import { useEffect } from 'react';
import {
  NavLink, Navigate as Redirect, useLocation,
} from 'react-router-dom';
import {
  Button, Container, Header, Icon, Segment,
} from 'semantic-ui-react';
import * as jose from 'jose';
import queryString from 'query-string';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import './BackgroundAnimation.css';
import { useTranslation } from 'react-i18next';
import AlertContainer from '../components/alerts/AlertContainer';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import { RootState } from '../stores/store';
import { authRequestClear } from '../stores/auth/actionCreators';
import ResourceStatus from '../stores/resourceStatus';
import CenterInPage from '../components/CenterInPage';
import { useTitle } from '../components/TitleContext';
import { withRouter } from '../WithRouter';

interface Props {
  status: ResourceStatus;

  clearStatus: () => void;
}

function ResetPasswordPage({ status, clearStatus }: Props) {
  const location = useLocation();
  const { token } = queryString.parse(location.search);
  const { t } = useTranslation();
  const { setTitle } = useTitle();

  useEffect(() => {
    clearStatus();
    setTitle(t('pages.resetPassword.title'));
  }, [clearStatus, setTitle, t]);

  if (typeof token !== 'string') {
    return <Redirect to="/login" />;
  }

  const payload = jose.decodeJwt(token);
  if (!(payload)) {
    return <Redirect to="/login" />;
  }

  const newUser = payload.type === 'PASSWORD_SET';

  if (status === ResourceStatus.FETCHED) {
    return (
      <>
        <div className="bg" />
        <div className="bg bg2" />
        <div className="bg bg3" />
        <AlertContainer internal />
        <Container>
          <CenterInPage>
            <Segment color="green" size="large">
              <Header as="h1">
                {newUser ? t('pages.resetPassword.setPassword') : t('pages.resetPassword.resetPassword')}
              </Header>
              <p>{t('pages.resetPassword.successMessage')}</p>
              <Button as={NavLink} to="/login" style={{ marginTop: '1em' }} basic>
                <Icon name="arrow left" basic />
                {t('pages.forgotPassword.back')}
              </Button>
            </Segment>
          </CenterInPage>
        </Container>
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
            <Header as="h1">
              {newUser ? t('pages.resetPassword.setPassword') : t('pages.resetPassword.resetPassword')}
            </Header>
            <ResetPasswordForm
              token={token}
            />
            <Button as={NavLink} to="/login" style={{ marginTop: '1em' }} basic>
              <Icon name="arrow left" basic />
              {t('pages.forgotPassword.back')}
            </Button>
          </Segment>
        </CenterInPage>
      </Container>
    </>
  );
}

const mapStateToProps = (state: RootState) => ({
  status: state.auth.passwordRequest,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  clearStatus: () => dispatch(authRequestClear()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage));
