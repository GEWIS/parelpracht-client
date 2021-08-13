import {
  Dropdown, Form, Input, Segment,
} from 'semantic-ui-react';
import React, { ChangeEvent } from 'react';
import validator from 'validator';
import { withTranslation, WithTranslation } from 'react-i18next';
import { CustomRecipient, Gender } from '../../clients/server.generated';

interface Props extends WithTranslation {
  recipient: CustomRecipient;

  updateRecipientAttribute: (attribute: string, value: string) => void;
  updateRecipientGender: (gender: Gender) => void;
}

interface State {}

class CustomInvoiceRecipient extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      recipient, updateRecipientAttribute, updateRecipientGender, t,
    } = this.props;

    return (
      <Segment secondary style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'black' }}>
        <h2>{t('pages.customInvoice.recipientDetails')}</h2>
        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field
              required
              id="form-recipient-name"
              fluid
              control={Input}
              label={t('companies.props.name')}
              value={recipient.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateRecipientAttribute(
                'name', e.target.value,
              )}
              error={validator.isEmpty(recipient.name)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              id="form-recipient-organization-name"
              fluid
              control={Input}
              label={t('pages.customInvoice.organizationName')}
              value={recipient.organizationName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateRecipientAttribute(
                'organizationName', e.target.value,
              )}
            />
            <Form.Field required>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-gender">{t('entities.user.props.gender.header')}</label>
              <Dropdown
                id="form-recipient-gender"
                selection
                placeholder="Gender"
                value={recipient.gender}
                options={[
                  { key: 0, text: t('entities.user.props.gender.male'), value: Gender.MALE },
                  { key: 1, text: t('entities.user.props.gender.female'), value: Gender.FEMALE },
                  { key: 2, text: t('entities.user.props.gender.unknown'), value: Gender.UNKNOWN },
                ]}
                onChange={(e, data) => {
                  updateRecipientGender(data.value as Gender);
                }}
                fluid
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              id="form-recipient-street"
              fluid
              control={Input}
              label={t('companies.props.street')}
              value={recipient.street}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateRecipientAttribute(
                'street', e.target.value,
              )}
            />
            <Form.Field
              id="form-recipient-postal-code"
              fluid
              control={Input}
              label={t('companies.props.postalCode')}
              value={recipient.postalCode}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateRecipientAttribute(
                'postalCode', e.target.value,
              )}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              id="form-recipient-city"
              fluid
              control={Input}
              label={t('companies.props.city')}
              value={recipient.city}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateRecipientAttribute(
                'city', e.target.value,
              )}
            />
            <Form.Field
              id="form-recipient-country"
              fluid
              control={Input}
              label={t('companies.props.country')}
              value={recipient.country}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateRecipientAttribute(
                'country', e.target.value,
              )}
            />
          </Form.Group>
        </Form>
      </Segment>
    );
  }
}

export default withTranslation()(CustomInvoiceRecipient);
