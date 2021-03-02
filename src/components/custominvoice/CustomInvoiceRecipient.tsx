import {
  Dropdown, Form, Input, Segment,
} from 'semantic-ui-react';
import React, { ChangeEvent } from 'react';
import validator from 'validator';
import { CustomRecipient, Gender } from '../../clients/server.generated';

interface Props {
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
      recipient, updateRecipientAttribute, updateRecipientGender,
    } = this.props;
    return (
      <Segment secondary>
        <h2>Recipient details</h2>
        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field
              required
              id="form-recipient-name"
              fluid
              control={Input}
              label="Name"
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
              label="Organization name"
              value={recipient.organizationName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateRecipientAttribute(
                'organizationName', e.target.value,
              )}
            />
            <Form.Field required>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-gender">Gender</label>
              <Dropdown
                id="form-recipient-gender"
                selection
                placeholder="Gender"
                value={recipient.gender}
                options={[
                  { key: 0, text: 'Male', value: Gender.MALE },
                  { key: 1, text: 'Female', value: Gender.FEMALE },
                  { key: 2, text: 'Unknown', value: Gender.UNKNOWN },
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
              required
              id="form-recipient-street"
              fluid
              control={Input}
              label="Street"
              value={recipient.street}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateRecipientAttribute(
                'street', e.target.value,
              )}
              error={validator.isEmpty(recipient.street)}
            />
            <Form.Field
              required
              id="form-recipient-postal-code"
              fluid
              control={Input}
              label="Postal code"
              value={recipient.postalCode}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateRecipientAttribute(
                'postalCode', e.target.value,
              )}
              error={!validator.isPostalCode(recipient.postalCode, 'any')}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
              id="form-recipient-city"
              fluid
              control={Input}
              label="City"
              value={recipient.city}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateRecipientAttribute(
                'city', e.target.value,
              )}
              error={validator.isEmpty(recipient.city)}
            />
            <Form.Field
              id="form-recipient-country"
              fluid
              control={Input}
              label="Country"
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

export default CustomInvoiceRecipient;
