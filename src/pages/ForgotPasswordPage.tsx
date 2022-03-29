import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Dispatch } from 'redux';
import {
  Button,
  Container, Header, Icon, Segment,
} from 'semantic-ui-react';
import './BackgroundAnimation.css';
import { useTranslation } from 'react-i18next';
import AlertContainer from '../components/alerts/AlertContainer';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import { authRequestClear } from '../stores/auth/actionCreators';
import ResourceStatus from '../stores/resourceStatus';
import { RootState } from '../stores/store';
import CenterInPage from '../components/CenterInPage';
import { useTitle } from '../components/TitleContext';

interface Props {
  status: ResourceStatus;

  clearStatus: () => void;
}

function ForgotPasswordPage(props: Props) {
  const { t } = useTranslation();
  const { setTitle } = useTitle();

  useEffect(() => {
    props.clearStatus();
    setTitle(t('pages.forgotPassword.title'));
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
                {t('pages.forgotPassword.header')}
              </Header>
              <p>
                {t('pages.forgotPassword.successMessage')}
              </p>
              <Button as={NavLink} to="/login" style={{ marginTop: '1em' }} basic>
                <Icon name="arrow left" />
                Back to login
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
              {t('pages.forgotPassword.header')}
            </Header>
            <ForgotPasswordForm />
            <Button as={NavLink} to="/login" style={{ marginTop: '1em' }} basic>
              <Icon name="arrow left" />
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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordPage);
