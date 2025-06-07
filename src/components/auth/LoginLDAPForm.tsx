import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button, Checkbox, Form, Input } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { authLoginLDAP } from '../../stores/auth/actionCreators';

interface Props {
  login: (username: string, password: string, rememberMe: boolean) => void;
}

function LoginLDAPForm(props: Props) {
  const { t } = useTranslation();
  const [username, changeUsername] = useState('');
  const [password, changePassword] = useState('');
  const [rememberMe, changeRememberMe] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current!.focus();
  }, []);

  return (
    <Form size="large">
      <Form.Field>
        <label htmlFor="form-input-username">{t('pages.login.username')}</label>
        <Input
          id="form-input-username"
          icon="user"
          value={username}
          iconPosition="left"
          onChange={(e: ChangeEvent<HTMLInputElement>) => changeUsername(e.target.value)}
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
      <Button fluid primary size="large" type="submit" onClick={() => props.login(username, password, rememberMe)}>
        {t('pages.login.loginLDAPButton')}
      </Button>
    </Form>
  );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  login: (username: string, password: string, rememberMe: boolean) =>
    dispatch(authLoginLDAP(username, password, rememberMe)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginLDAPForm);
