import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Button, Checkbox, Form, Input,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { authLoginLocal } from '../../stores/auth/actionCreators';

interface Props {
  login: (email: string, password: string, rememberMe: boolean) => void,
}

function LoginLocalForm(props: Props) {
  const { t } = useTranslation();
  const [email, changeEmail] = useState('');
  const [password, changePassword] = useState('');
  const [rememberMe, changeRememberMe] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current!.focus();
  }, []);

  return (
    <Form size="large">
      <Form.Field>
                <label htmlFor="form-input-email">{t('pages.login.email')}</label>
        <Input
          id="form-input-email"
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
        label={t('pages.login.password')}
        onChange={(e: ChangeEvent<HTMLInputElement>) => changePassword(e.target.value)}
      />
      <Form.Field>
        <Checkbox
          toggle
          id="form-input-remember-me"
          checked={rememberMe}
          onChange={(_, data) => changeRememberMe(data.checked as boolean)}
          label={t('pages.login.rememberMe')}
        />
      </Form.Field>
      <Button
        fluid
        primary
        size="large"
        type="submit"
        onClick={() => props.login(email, password, rememberMe)}
      >
        {t('pages.login.loginButton')}
      </Button>
    </Form>
  );
}

const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  login: (email: string, password: string, rememberMe: boolean) => dispatch(
    authLoginLocal(email, password, rememberMe),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginLocalForm);
