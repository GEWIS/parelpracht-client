import { useTranslation } from 'react-i18next';
import { Button, Checkbox, Dropdown, Form, Input } from 'semantic-ui-react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Gender } from '../../clients/server.generated';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { authSetup } from '../../stores/auth/actionCreators';
import { useNavigate } from 'react-router-dom';
import { NavigateFunction } from 'react-router/dist/lib/hooks';

interface Props {
  setup: (
    email: string,
    firstname: string,
    lastname: string,
    gender: string,
    password: string,
    rememberMe: boolean,
    navigate: NavigateFunction) => void;
}

function SetupForm(props: Props) {
  const { t } = useTranslation();
  const [email, changeEmail] = useState('');
  const [firstName, changeFirstName] = useState('');
  const [lastName, changeLastName] = useState('');
  const [gender, changeGender] = useState(Gender.UNKNOWN);
  const [password, changePassword] = useState('');
  const [rememberMe, changeRememberMe] = useState(false);

  const inputRef = useRef<Input>(null);
  useEffect(() => {
    inputRef.current!.focus();
  }, []);

  const navigate = useNavigate();

  return (
    <Form siz={'large'}>
      <Form.Field>
        <Input
          value={email}
          placeholder={t('pages.setup.email')}
          onChange={(e: ChangeEvent<HTMLInputElement>) => changeEmail(e.target.value)}
          ref={inputRef}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder={t('pages.setup.firstname')}
          value={firstName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => changeFirstName(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder={t('pages.setup.lastname')}
          value={lastName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => changeLastName(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <Dropdown
          placeholder={t('pages.setup.gender.placeholder')}
          fluid
          selection
          options={[
            { key: 'male', text: t('pages.setup.gender.options.male'), value: Gender.MALE },
            { key: 'female', text: t('pages.setup.gender.options.female'), value: Gender.FEMALE },
            { key: 'other', text: t('pages.setup.gender.options.other'), value: Gender.OTHER },
          ]}
          onChange={(_e, data) => changeGender(data.value as Gender)}
        />
      </Form.Field>
      <Form.Field
        id="form-input-password"
        control={Input}
        value={password}
        type="password"
        placeholder={t('pages.setup.password')}
        onChange={(e: ChangeEvent<HTMLInputElement>) => changePassword(e.target.value)}
      />
      <Form.Field>
        <Checkbox
          toggle
          id="form-input-remember-me"
          checked={rememberMe}
          onChange={(_e, data) => changeRememberMe(data.checked as boolean)}
          label={t('pages.login.rememberMe')}
        />
      </Form.Field>
      <Button
        fluid
        primary
        size="large"
        type="submit"
        onClick={() => props.setup(email, firstName, lastName, gender, password, rememberMe, navigate)}
      >
        {t('pages.setup.setupButton')}
      </Button>

    </Form>
  );
}


const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setup: (
    email: string,
    firstName: string,
    lastName: string,
    gender: Gender,
    password: string,
    rememberMe: boolean,
    navigate: NavigateFunction,
  )=> dispatch(
    authSetup(email, firstName, lastName, gender, password, rememberMe, navigate),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(SetupForm);