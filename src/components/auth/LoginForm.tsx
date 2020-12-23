import React, { ChangeEvent, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Button, Form, Header, Input,
} from 'semantic-ui-react';
import { authLogin } from '../../stores/auth/actionCreators';
import { RootState } from '../../stores/store';

interface Props {
  login: (email: string, password: string) => void,
}

interface State {
  email: string;
  password: string;
}

function LoginForm(props: Props) {
  const [email, changeEmail] = useState('');
  const [password, changePassword] = useState('');

  return (
    <Form size="large">
      <Header as="h2" icon="user">
        CRM
      </Header>
      <Form.Field
        id="form-input-email"
        control={Input}
        icon="user"
        value={email}
        iconPosition="left"
        placeholder="Email address"
        onChange={(e: ChangeEvent<HTMLInputElement>) => changeEmail(e.target.value)}
      />
      <Form.Field
        id="form-input-password"
        control={Input}
        value={password}
        type="password"
        icon="lock"
        iconPosition="left"
        placeholder="Password"
        onChange={(e: ChangeEvent<HTMLInputElement>) => changePassword(e.target.value)}
      />
      <Button
        fluid
        primary
        size="large"
        type="submit"
        onClick={() => props.login(email, password)}
      >
        Login
      </Button>
    </Form>
  );
}

const mapStateToProps = (state: RootState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  login: (email: string, password: string) => dispatch(
    authLogin(email, password),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
