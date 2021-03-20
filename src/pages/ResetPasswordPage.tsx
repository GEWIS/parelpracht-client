import React, { useState, useEffect } from 'react';
import {
  NavLink, Redirect, RouteComponentProps, withRouter,
} from 'react-router-dom';
import {
  Button,
  Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import queryString from 'query-string';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import AlertContainer from '../components/alerts/AlertContainer';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import { RootState } from '../stores/store';
import { authRequestClear } from '../stores/auth/actionCreators';
import ResourceStatus from '../stores/resourceStatus';

interface Props extends RouteComponentProps {
  status: ResourceStatus;

  clearStatus: () => void;
}

function ResetPasswordPage(props: Props) {
  const { token } = queryString.parse(props.location.search);
  if (typeof token !== 'string') {
    return <Redirect to="/login" />;
  }

  const payload = jwt.decode(token);
  if (!(payload && typeof payload !== 'string')) {
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
  }, []);

  if (props.status === ResourceStatus.FETCHED) {
    return (
      <>
        <AlertContainer internal />
        <Container>
          <Grid textAlign="center" verticalAlign="middle" style={{ height: '100vh' }}>
            <Grid.Column width={6}>
              <Header as="h1">
                {newUser ? 'Set your password' : 'Reset your password'}
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
              {newUser ? 'Set your password' : 'Reset your password'}
            </Header>
            <Segment>
              <h3>
                Password requirements:
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
                    <td>Eight characters in length</td>
                  </tr>
                  <tr>
                    <td>
                      {lowerCase ? <Icon name="check" color="green" /> : <Icon name="close" color="red" />}
                    </td>
                    <td>One lower case character</td>
                  </tr>
                  <tr>
                    <td>
                      {upperCase ? <Icon name="check" color="green" /> : <Icon name="close" color="red" />}
                    </td>
                    <td>One upper case character</td>
                  </tr>
                  <tr>
                    <td>
                      {numbers ? <Icon name="check" color="green" /> : <Icon name="close" color="red" />}
                    </td>
                    <td>One number</td>
                  </tr>
                  <tr>
                    <td>
                      {symbols ? <Icon name="check" color="green" /> : <Icon name="close" color="red" />}
                    </td>
                    <td>One symbol</td>
                  </tr>
                </table>
              </p>
              <ResetPasswordForm
                token={token}
                newUser={newUser}
                validatePassword={validatePassword}
              />
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
