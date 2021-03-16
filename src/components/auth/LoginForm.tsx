import React, {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Button, Checkbox, Form, Input,
} from 'semantic-ui-react';
import { authLogin } from '../../stores/auth/actionCreators';

interface Props {
  login: (email: string, password: string, rememberMe: boolean) => void,
}

function LoginForm(props: Props) {
  const [email, changeEmail] = useState('');
  const [password, changePassword] = useState('');
  const [rememberMe, changeRememberMe] = useState(false);

  const inputRef = useRef<Input>(null);
  useEffect(() => {
    inputRef.current!.focus();
  }, []);

  return (
    <Form size="large">
      <Form.Field>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="form-input-email">Email address</label>
        <Input
          id="form-input-email"
          control={Input}
          icon="user"
          value={email}
          iconPosition="left"
          onChange={(e: ChangeEvent<HTMLInputElement>) => changeEmail(e.target.value)}
          ref={inputRef}
        />
      </Form.Field>
      <Form.Field
        id="form-input-password"
        control={Input}
        value={password}
        type="password"
        icon="lock"
        iconPosition="left"
        label="Password"
        onChange={(e: ChangeEvent<HTMLInputElement>) => changePassword(e.target.value)}
      />
      <Form.Field>
        <Checkbox
          toggle
          id="form-input-remember-me"
          checked={rememberMe}
          onChange={(e, data) => changeRememberMe(data.checked as boolean)}
          fluid
          label="Remember me"
        />
      </Form.Field>
      <Button
        fluid
        primary
        size="large"
        type="submit"
        onClick={() => props.login(email, password, rememberMe)}
      >
        Login
      </Button>
    </Form>
  );
}

const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  login: (email: string, password: string, rememberMe: boolean) => dispatch(
    authLogin(email, password, rememberMe),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
