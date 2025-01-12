import React, { ChangeEvent, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Button, Form, Input,
} from 'semantic-ui-react';
import validator from 'validator';
import { useTranslation } from 'react-i18next';
import { authResetPassword } from '../../stores/auth/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import PasswordStrength from './PasswordStrength';

interface Props {
  token: string;
  status: ResourceStatus;
  resetPassword: (password: string, passwordRepeat: string, token: string) => void;
}

function ResetPasswordForm(props: Props) {
  const { t } = useTranslation();
  const [password, changePassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [passwordRepeat, changePasswordRepeat] = useState('');

  return (
    <Form size="large">
      <Form.Field
        id="form-input-password"
        control={Input}
        value={password}
        type="password"
        icon="lock"
        iconPosition="left"
        label={t('pages.resetPassword.newPassword')}
        error={
          validator.isEmpty(password) || !validator.isStrongPassword(password)
        }
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          changePassword(e.target.value);
        }}
      />
      <Form.Field
        id="form-input-password-repeat"
        control={Input}
        value={passwordRepeat}
        type="password"
        icon="lock"
        iconPosition="left"
        error={
          !passwordIsValid || !validator.equals(passwordRepeat, password)
        }
        label={t('pages.resetPassword.repeatPassword')}
        onChange={(e: ChangeEvent<HTMLInputElement>) => changePasswordRepeat(e.target.value)}
      />
      <PasswordStrength
        password={password}
        setPasswordIsValid={setPasswordIsValid}
      />
      <Button
        fluid
        primary
        size="large"
        type="submit"
        disabled={!passwordIsValid}
        onClick={() => props.resetPassword(password, passwordRepeat, props.token)}
        loading={props.status === ResourceStatus.FETCHING}
      >
        {t('pages.resetPassword.submit')}
      </Button>
    </Form>
  );
}

const mapStateToProps = (state: RootState) => ({
  status: state.auth.passwordRequest,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  resetPassword: (password: string, passwordRepeat: string, token: string) => dispatch(
    authResetPassword(password, passwordRepeat, token),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordForm);
