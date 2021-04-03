import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Dispatch } from 'redux';
import {
  Button,
  Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import './BackgroundAnimation.css';
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
              <Header as="h1">
                Reset your password
              </Header>
              <Segment color="green" size="large">
                <p>
                  {`Check your email for a link to reset your password.
                  If it doesn't appear within a few minutes,
                  check your spam folder.`}
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
            <Header as="h1">
              Reset your password
            </Header>
            <Segment>
              <ForgotPasswordForm />
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

const mapStateToProps = (state: RootState) => ({
  status: state.auth.passwordRequest,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  clearStatus: () => dispatch(authRequestClear()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordPage);
