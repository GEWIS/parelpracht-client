import { Icon } from 'semantic-ui-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import validator from 'validator';

interface PasswordStrengthProps {
  password: string;
  setPasswordIsValid: (valid: boolean) => void;
}

function PasswordStrength(props: PasswordStrengthProps) {
  const { password, setPasswordIsValid } = props;
  const { t } = useTranslation();

  const [eightCharacters, setEightCharacters] = useState(false);
  const [lowerCase, setLowerCase] = useState(false);
  const [upperCase, setUpperCase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);

  const hasEightCharacters = (p: string) => {
    return p.length >= 8;
  };
  const hasLowerCase = (p: string) => {
    return /[a-z]/.test(p);
  };
  const hasUpperCase = (p: string) => {
    return /[A-Z]/.test(p);
  };
  const hasNumbers = (p: string) => {
    return /[0-9]/.test(p);
  };
  const hasSymbols = (p: string) => {
    return validator.isStrongPassword(p, {
      minLength: 0,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 1,
    });
  };
  const validatePassword = (p: string) => {
    const passwordHasEightCharacters = hasEightCharacters(p);
    const passwordHasLowerCase = hasLowerCase(p);
    const passwordHasUpperCase = hasUpperCase(p);
    const passwordHasNumbers = hasNumbers(p);
    const passwordHasSymbols = hasSymbols(p);
    setEightCharacters(passwordHasEightCharacters);
    setLowerCase(passwordHasLowerCase);
    setUpperCase(passwordHasUpperCase);
    setNumbers(passwordHasNumbers);
    setSymbols(passwordHasSymbols);
    setPasswordIsValid(passwordHasEightCharacters && passwordHasLowerCase && passwordHasUpperCase && passwordHasNumbers && passwordHasSymbols);
  };

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  return (
    <>
      <h3>
        {t('pages.resetPassword.requirements.header')}
      </h3>
      <table
        style={{
          textAlign: 'left',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '1em',
        }}
      >
        <tbody>
        <tr>
          <td>
            {eightCharacters ? <Icon name="check" color="green"/> : <Icon name="close" color="red"/>}
          </td>
          <td>{t('pages.resetPassword.requirements.length')}</td>
        </tr>
        <tr>
          <td>
            {lowerCase ? <Icon name="check" color="green"/> : <Icon name="close" color="red"/>}
          </td>
          <td>{t('pages.resetPassword.requirements.lowerCase')}</td>
        </tr>
        <tr>
          <td>
            {upperCase ? <Icon name="check" color="green"/> : <Icon name="close" color="red"/>}
          </td>
          <td>{t('pages.resetPassword.requirements.upperCase')}</td>
        </tr>
        <tr>
          <td>
            {numbers ? <Icon name="check" color="green"/> : <Icon name="close" color="red"/>}
          </td>
          <td>{t('pages.resetPassword.requirements.number')}</td>
        </tr>
        <tr>
          <td>
            {symbols ? <Icon name="check" color="green"/> : <Icon name="close" color="red"/>}
          </td>
          <td>{t('pages.resetPassword.requirements.symbol')}</td>
        </tr>
        </tbody>
      </table>
    </>
  );
}

export default PasswordStrength;