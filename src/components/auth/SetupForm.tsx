import { useTranslation } from 'react-i18next';
import { Button, Checkbox, Dropdown, Form, Input } from 'semantic-ui-react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Gender } from '../../clients/server.generated';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { authSetup } from '../../stores/auth/actionCreators';
import validator from 'validator';

interface Props {
  setup: (
    email: string,
    firstname: string,
    preposition: string,
    lastname: string,
    gender: string,
    password: string,
    rememberMe: boolean) => void;
}

function SetupForm(props: Props) {
  const { t } = useTranslation();
  const [email, changeEmail] = useState('');
  const [firstName, changeFirstName] = useState('');
  const [preposition, changePreposition] = useState('');
  const [lastName, changeLastName] = useState('');
  const [gender, changeGender] = useState(Gender.UNKNOWN);
  const [password, changePassword] = useState('');
  const [rememberMe, changeRememberMe] = useState(false);

  const inputRef = useRef<Input>(null);
  useEffect(() => {
    inputRef.current!.focus();
  }, []);

  const formHasErrors = () =>{
    return !validator.isEmail(email) || !validator.isStrongPassword(password);
  };

  return (
    <Form
      error={
        !validator.isStrongPassword(password) || !validator.isEmpty(email)
      }
      onSubmit={() => {
        if (!formHasErrors()) {
          props.setup(email, firstName, preposition, lastName, gender, password, rememberMe);
        }
      }}
    >
      <Form.Field
        error={
        !validator.isEmail(email)
      }
      >
        <Input
          value={email}
          placeholder={t('pages.login.email')}
          onChange={(e: ChangeEvent<HTMLInputElement>) => changeEmail(e.target.value)}
          ref={inputRef}
          required={true}
          type="email"
        />
      </Form.Field>
      <Form.Field
        error={validator.isEmpty(firstName)}
      >
        <Input
          placeholder={t('entities.user.props.firstName')}
          value={firstName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => changeFirstName(e.target.value)}
          required={true}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder={t('entities.user.props.preposition')}
          value={preposition}
          onChange={(e: ChangeEvent<HTMLInputElement>) => changePreposition(e.target.value)}
        />
      </Form.Field>
      <Form.Field
        error={validator.isEmpty(lastName)}
      >
        <Input
          placeholder={t('entities.user.props.lastName')}
          value={lastName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => changeLastName(e.target.value)}
          required={true}
        />
      </Form.Field>
      <Form.Field
        error={gender === Gender.UNKNOWN}
      >
        <Dropdown
          placeholder={t('entities.user.props.gender.header')}
          fluid
          selection
          options={[
            { key: 'male', text: t('entities.user.props.gender.male'), value: Gender.MALE },
            { key: 'female', text: t('entities.user.props.gender.female'), value: Gender.FEMALE },
            { key: 'other', text: t('entities.user.props.gender.other'), value: Gender.OTHER },
          ]}
          onChange={(_e, data) => changeGender(data.value as Gender)}
          required={true}
          color='purple'
        />
      </Form.Field>
      <Form.Field
        name='password-field'
        id="form-input-password"
        control={Input}
        value={password}
        type="password"
        placeholder={t('pages.login.password')}
        onChange={(e: ChangeEvent<HTMLInputElement>) => changePassword(e.target.value)}
        required={true}
        error={
          !validator.isStrongPassword(password)
        }
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
      >
        {t('pages.setup')}
      </Button>

    </Form>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setup: (
    email: string,
    firstName: string,
    preposition: string,
    lastName: string,
    gender: Gender,
    password: string,
    rememberMe: boolean,
  )=> dispatch(
    authSetup(email, firstName, preposition, lastName, gender, password, rememberMe),
  ),
});

export default connect(null, mapDispatchToProps)(SetupForm);