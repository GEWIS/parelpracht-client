import { useTranslation } from 'react-i18next';
import { Contact, ContactFunction, ContactParams, Gender, Roles } from '../../../clients/server.generated';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import AuthorizationComponent from '../../AuthorizationComponent';
import PropsButtons from '../../PropsButtons';
import { SingleEntities } from '../../../stores/single/single';
import ResourceStatus from '../../../stores/resourceStatus';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { getSingle } from '../../../stores/single/selectors';
import { formatContactName, formatFunction } from '../../../helpers/contact';
import { Dropdown, Form, Input, TextArea } from 'semantic-ui-react';
import validator from 'validator';
import { createSingle, deleteSingle, fetchSingle, saveSingle } from '../../../stores/single/actionCreators';
import { showTransientAlert } from '../../../stores/alerts/actionCreators';
import { TransientAlert } from '../../../stores/alerts/actions';
import { useNavigate } from 'react-router';

interface Props {
  create?: boolean;
  contact: Contact;
  onCompanyPage: boolean;
  onCancel?: () => void;

}

const ContactProps = (props: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<boolean>(props.create ?? false);
  const [formState, setFormState] = useState<ContactParams>(props.contact);

  const status = useSelector((state: RootState) => {
    return getSingle<Contact>(state, SingleEntities.Contact).status;
  });
  const prevStatusRef = useRef(status);

  const updateFormState = (updatedValues: Partial<ContactParams>) => {
    setFormState((prevState) => ({
      ...prevState,
      ...updatedValues,
    } as ContactParams));
  };

  const dispatch = useDispatch();

  const saveContact = (id: number, contact: ContactParams) => {
    dispatch(saveSingle(SingleEntities.Contact, id, contact));
  };
  const createContact = (contact: ContactParams) => {
    dispatch(createSingle(SingleEntities.Contact, contact));
  };
  const deleteContact = (id: number) => {
    dispatch(deleteSingle(SingleEntities.Contact, id));
  };
  const showAlert = (alert: TransientAlert) => {
    dispatch(showTransientAlert(alert));
  };
  const fetchCompany = (id: number) => {
    dispatch(fetchSingle(SingleEntities.Company, id));
  };

  useEffect(() => {
    if (prevStatusRef.current === ResourceStatus.SAVING
      && status === ResourceStatus.FETCHED) {
      // eslint-disable-next-line react/no-did-update-set-state
      setEditing(false);
      if (props.create) {
        showAlert({
          title: 'Success',
          message: 'Successfully created new contact.',
          type: 'success',
          displayTimeInMs: 3000,
        });
      } else {
        showAlert({
          title: 'Success',
          message: `Properties of ${formatContactName(
            formState.firstName,
            formState.lastNamePreposition,
            formState.lastName,
          )} successfully updated.`,
          type: 'success',
          displayTimeInMs: 3000,
        });
      }
    }
    prevStatusRef.current = status;
  }, [status]);

  const toParams = (): ContactParams => {
    return new ContactParams({
      firstName: formState.firstName,
      lastNamePreposition: formState.lastNamePreposition,
      lastName: formState.lastName,
      gender: formState.gender,
      email: formState.email,
      telephone: formState.telephone,
      function: formState.function,
      comments: formState.comments,
      companyId: props.contact.companyId,

    });
  };

  const edit = () => {
    setEditing(true);
  };

  const cancel = () => {
    if (!props.create) {
      setEditing(false);
    } else if (props.onCancel) {
      props.onCancel();
    }
  };

  const save = () => {
    if (props.create) {
      createContact(toParams());
    } else {
      saveContact(props.contact.id, toParams());
    }
  };

  const remove = () => {
    if (props.create) {
      return;
    }
    deleteContact(props.contact.id);
    if (props.onCompanyPage) {
      navigate(`/company/${props.contact.companyId}`);
      fetchCompany(props.contact.companyId);
    } else {
      navigate('/contact');
    }
  };

  const emailIsValid = (): boolean => {
    if ([
      ContactFunction.SIGNATORY_AUTHORIZED,
      ContactFunction.ASSISTING,
      ContactFunction.OLD,
    ].includes(formState.function)) {
      return validator.isEmpty(formState.email) || validator.isEmail(formState.email);
    } else {
      return validator.isEmail(formState.email);
    }
  };

  const propsHaveErrors = () => {
    return (validator.isEmpty(formState.lastName)
      || (!validator.isEmpty(formState.telephone!) && !validator.isMobilePhone(formState.telephone!))
      || !emailIsValid()
    );
  };

  const deleteButtonActive = () => {
    if (props.create) {
      return undefined;
    }
    return !(props.contact.contracts.length > 0);
  };

  return (
    <>
      <h2>
        {props.create ? t('entities.contact.newContact') : t('entities.company.props.details')}

        <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
          <PropsButtons
            editing={editing}
            canEdit
            canDelete={deleteButtonActive()}
            canSave={!propsHaveErrors()}
            entity={SingleEntities.Contact}
            status={ResourceStatus.FETCHING}
            cancel={cancel}
            edit={edit}
            save={save}
            remove={remove}
          />
        </AuthorizationComponent>
      </h2>

      <Form style={{ marginTop: '2em' }}>
        <Form.Group>
          <Form.Field
            disabled={!editing}
            id="form-input-first-name"
            fluid
            control={Input}
            label={t('entities.contact.props.firstName')}
            placeholder={t('entities.contact.props.firstName')}
            value={formState.firstName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateFormState({
              firstName: e.target.value,
            })}
            width={6}
          />
          <Form.Field
            disabled={!editing}
            id="form-input-middle-name"
            fluid
            control={Input}
            label={t('entities.contact.props.middleName')}
            placeholder={t('entities.contact.props.middleName')}
            value={formState.lastNamePreposition}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateFormState({
              lastNamePreposition: e.target.value,
            })}
            width={4}
          />
          <Form.Field
            disabled={!editing}
            required
            id="form-input-last-name"
            fluid
            control={Input}
            label={t('entities.contact.props.lastName')}
            placeholder={t('entities.contact.props.lastName')}
            value={formState.lastName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateFormState({
              lastName: e.target.value,
            })}
            width={6}
            error={
              validator.isEmpty(formState.lastName)
            }
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field required disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-gender">{t('entities.contact.props.gender.gender')}</label>
            <Dropdown
              id="form-input-gender"
              selection
              placeholder="Gender"
              value={formState.gender}
              options={[
                { key: 0, text: t('entities.contact.props.gender.male'), value: Gender.MALE },
                { key: 1, text: t('entities.contact.props.gender.female'), value: Gender.FEMALE },
                { key: 2, text: t('entities.contact.props.gender.unknown'), value: Gender.UNKNOWN },
              ]}
              onChange={(e, data) => updateFormState({
                gender: data.value as Gender,
              })}
              fluid
            />
          </Form.Field>
          <Form.Field required disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-function">{t('entities.contact.props.function.header')}</label>
            <Dropdown
              id="form-input-function"
              selection
              placeholder={t('entities.contact.props.function.header')}
              value={formState.function}
              options={Object.values(ContactFunction).map((x, i) => ({
                key: i, value: x, text: formatFunction(x),
              }))}
              onChange={(e, data) => updateFormState({
                function: data.value as ContactFunction,
              })}
              fluid
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            disabled={!editing}
            id="form-input-email"
            fluid
            control={Input}
            label={t('entities.contact.props.email')}
            placeholder={t('entities.contact.props.email')}
            value={formState.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateFormState({
              email: e.target.value,
            })}
            error={
              !emailIsValid()
            }
          />
          <Form.Field
            disabled={!editing}
            id="form-input-telephone"
            fluid
            placeholder={t('entities.company.props.number')}
            control={Input}
            label={t('entities.company.props.number')}
            value={formState.telephone}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateFormState({
              telephone: e.target.value,
            })}
            error={
              !validator.isEmpty(formState.telephone!) && !validator.isMobilePhone(formState.telephone!)
            }
          />
        </Form.Group>
        <Form.Field>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="form-input-comments">
            {t('entities.contact.props.comments')}
          </label>
          <TextArea
            id="form-delivery-spec-english"
            value={formState.comments}
            onChange={
              (e) => updateFormState({ comments: e.target.value })
            }
            placeholder={t('entities.contact.props.comments')}
          />
        </Form.Field>
      </Form>

    </>
  );
};

export default ContactProps;
