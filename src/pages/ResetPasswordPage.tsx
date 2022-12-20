import React, { useState, useEffect } from 'react';
import {
  NavLink, Redirect, RouteComponentProps, withRouter,
} from 'react-router-dom';
import {
  Button, Container, Header, Icon, Segment,
} from 'semantic-ui-react';
import * as jose from 'jose';
import validator from 'validator';
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

interface Props extends RouteComponentProps {
  status: ResourceStatus;

  clearStatus: () => void;
}

function ResetPasswordPage(props: Props) {
  const { token } = queryString.parse(props.location.search);
  const { t } = useTranslation();
  const { setTitle } = useTitle();

  if (typeof token !== 'string') {
    return <Redirect to="/login" />;
  }

  const payload = jose.decodeJwt(token);
  if (!(payload)) {
    return <Redirect to="/login" />;
  }

  const [eightCharacters, changeEightCharacters] = useState(false);
  const [lowerCase, changeLowerCase] = useState(false);
  const [upperCase, changeUpperCase] = useState(false);
  const [numbers, changeNumbers] = useState(false);
  const [symbols, changeSymbols] = useState(false);

  const hasEightCharacters = (password: string) => {
    changeEightCharacters(password.length >= 8);
  };

  const hasLowerCase = (password: string) => {
    changeLowerCase(/[a-z]/.test(password));
  };
  const hasUpperCase = (password: string) => {
    changeUpperCase(/[A-Z]/.test(password));
  };
  const hasNumbers = (password: string) => {
    changeNumbers(/[0-9]/.test(password));
  };
  const hasSymbols = (password: string) => {
    changeSymbols(validator.isStrongPassword(password, {
      minLength: 0,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 1,
    }));
  };
  const validatePassword = (password: string) => {
    hasEightCharacters(password);
    hasLowerCase(password);
    hasUpperCase(password);
    hasNumbers(password);
    hasSymbols(password);
  };

  const newUser = payload.type === 'PASSWORD_SET';

  useEffect(() => {
    props.clearStatus();
    setTitle(t('pages.resetPassword.title'));
  }, []);

  if (props.status === ResourceStatus.FETCHED) {
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
          <Header as="h1">
            {newUser ? t('pages.resetPassword.setPassword') : t('pages.resetPassword.resetPassword')}
          </Header>
          <Segment>
            <h3>
              {t('pages.resetPassword.requirements.header')}
            </h3>
            <p>
              <table
                style={{
                  textAlign: 'left',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                <tr>
                  <td>
                    {eightCharacters ? <Icon name="check" color="green" /> : <Icon name="close" color="red" />}
                  </td>
                  <td>{t('pages.resetPassword.requirements.length')}</td>
                </tr>
                <tr>
                  <td>
                    {lowerCase ? <Icon name="check" color="green" /> : <Icon name="close" color="red" />}
                  </td>
                  <td>{t('pages.resetPassword.requirements.lowerCase')}</td>
                </tr>
                <tr>
                  <td>
                    {upperCase ? <Icon name="check" color="green" /> : <Icon name="close" color="red" />}
                  </td>
                  <td>{t('pages.resetPassword.requirements.upperCase')}</td>
                </tr>
                <tr>
                  <td>
                    {numbers ? <Icon name="check" color="green" /> : <Icon name="close" color="red" />}
                  </td>
                  <td>{t('pages.resetPassword.requirements.number')}</td>
                </tr>
                <tr>
                  <td>
                    {symbols ? <Icon name="check" color="green" /> : <Icon name="close" color="red" />}
                  </td>
                  <td>{t('pages.resetPassword.requirements.symbol')}</td>
                </tr>
              </table>
            </p>
            <ResetPasswordForm
              token={token}
              validatePassword={validatePassword}
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
