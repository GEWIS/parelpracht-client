import React, { useEffect } from 'react';
import {
  NavLink, Redirect, RouteComponentProps, withRouter,
} from 'react-router-dom';
import {
  Button,
  Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import queryString from 'query-string';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import AlertContainer from '../components/alerts/AlertContainer';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import { RootState } from '../stores/store';
import { authRequestClear } from '../stores/auth/actionCreators';
import ResourceStatus from '../stores/resourceStatus';

interface Props extends RouteComponentProps{
  status: ResourceStatus;

  clearStatus: () => void;
}

function ResetPasswordPage(props: Props) {
  const { token } = queryString.parse(props.location.search);
  if (typeof token !== 'string') {
    return <Redirect to="/login" />;
  }

  useEffect(() => {
    props.clearStatus();
  }, []);

  if (props.status === ResourceStatus.FETCHED) {
    return (
      <>
        <AlertContainer internal />
        <Container>
          <Grid textAlign="center" verticalAlign="middle" style={{ height: '100vh' }}>
            <Grid.Column width={6}>
              <Header as="h1">
                Reset your password
              </Header>
              <Segment color="green" size="large">
                <p>Password successfully changed!</p>
                <Button as={NavLink} to="/login" style={{ marginTop: '1em' }} basic>
                  <Icon name="arrow left" basic />
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
      <AlertContainer internal />
      <Container>
        <Grid textAlign="center" verticalAlign="middle" style={{ height: '100vh' }}>
          <Grid.Column width={6}>
            <Header as="h1">
              Reset your password
            </Header>
            <Segment>
              <ResetPasswordForm token={token} />
              <Button as={NavLink} to="/login" style={{ marginTop: '1em' }} basic>
                <Icon name="arrow left" basic />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage));
