import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Dispatch } from 'redux';
import {
  Button,
  Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import './BackgroundAnimation.css';
import { useTranslation } from 'react-i18next';
import AlertContainer from '../components/alerts/AlertContainer';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import { authRequestClear } from '../stores/auth/actionCreators';
import ResourceStatus from '../stores/resourceStatus';
import { RootState } from '../stores/store';

interface Props {
  status: ResourceStatus;

  clearStatus: () => void;
}

function ForgotPasswordPage(props: Props) {
  const { t } = useTranslation();
  useEffect(() => {
    props.clearStatus();
  }, []);

  if (props.status === ResourceStatus.FETCHED) {
    return (
      <>
        <div className="bg" />
        <div className="bg bg2" />
        <div className="bg bg3" />
        <AlertContainer internal />
        <Container>
          <Grid textAlign="center" verticalAlign="middle" style={{ height: '100vh' }}>
            <Grid.Column width={6}>
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
            </Grid.Column>
          </Grid>
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
        <Grid textAlign="center" verticalAlign="middle" style={{ height: '100vh' }}>
          <Grid.Column width={6}>
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
          </Grid.Column>
        </Grid>
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
