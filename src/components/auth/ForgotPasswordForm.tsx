import React, { ChangeEvent, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Button, Form, Header, Input,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { authForgotPassword } from '../../stores/auth/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';

interface Props {
  status: ResourceStatus,
  forgotPassword: (email: string) => void,
}

function ForgotPasswordForm(props: Props) {
  const { t } = useTranslation();
  const [email, changeEmail] = useState('');

  return (
    <Form size="large">
      <Header as="h1">
        <Header.Subheader>
          {t('pages.forgotPassword.enterEmail')}
        </Header.Subheader>
      </Header>
      <Form.Field
        id="form-input-email"
        control={Input}
        value={email}
        placeholder={t('pages.login.email')}
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
        {t('pages.forgotPassword.sendEmailButton')}
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
