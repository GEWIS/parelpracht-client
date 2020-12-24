import React, { ChangeEvent, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Dispatch } from 'redux';
import {
  Button, Form, Header, Icon, Input,
} from 'semantic-ui-react';
import { authForgotPassword } from '../../stores/auth/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';

interface Props {
  status: ResourceStatus,
  forgotPassword: (email: string) => void,
}

function ForgotPasswordForm(props: Props) {
  const [email, changeEmail] = useState('');

  return (
    <Form size="large">
      <Header as="h1">
        <Header.Subheader>
          Enter your email address and receive a password reset link.
        </Header.Subheader>
      </Header>
      <Form.Field
        id="form-input-email"
        control={Input}
        value={email}
        placeholder="Email address"
        onChange={(e: ChangeEvent<HTMLInputElement>) => changeEmail(e.target.value)}
      />
      <Button
        fluid
        primary
        size="large"
        type="submit"
        onClick={() => props.forgotPassword(email)}
        loading={props.status === ResourceStatus.FETCHING}
      >
        Send password reset email
      </Button>
    </Form>
  );
}

const mapStateToProps = (state: RootState) => ({
  status: state.auth.passwordRequest,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  forgotPassword: (email: string) => dispatch(
    authForgotPassword(email),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordForm);
