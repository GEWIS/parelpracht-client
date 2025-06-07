import {
  Form, Input, Segment,
} from 'semantic-ui-react';
import { ChangeEvent, Component } from 'react';
import validator from 'validator';
import { withTranslation, WithTranslation } from 'react-i18next';
import { CustomRecipient } from '../../clients/server.generated';

interface Props extends WithTranslation {
  recipient: CustomRecipient;

  updateRecipientAttribute: <T extends keyof CustomRecipient = keyof CustomRecipient>(attribute: T, value: CustomRecipient[T]) => void;
}

class CustomInvoiceRecipient extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      recipient, updateRecipientAttribute, t,
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
              label={t('entities.company.props.name')}
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
            <Form.Field
              required
              id="form-recipient-customer-number"
              fluid
              control={Input}
              label={t('pages.customInvoice.customerNumber')}
              value={recipient.number}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateRecipientAttribute(
                'number', e.target.value,
              )}
              error={validator.isEmpty(recipient.number)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              id="form-recipient-street"
              fluid
              control={Input}
              label={t('entities.company.props.street')}
              value={recipient.street}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateRecipientAttribute(
                'street', e.target.value,
              )}
            />
            <Form.Field
              id="form-recipient-postal-code"
              fluid
              control={Input}
              label={t('entities.company.props.postalCode')}
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
              label={t('entities.company.props.city')}
              value={recipient.city}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateRecipientAttribute(
                'city', e.target.value,
              )}
            />
            <Form.Field
              id="form-recipient-country"
              fluid
              control={Input}
              label={t('entities.company.props.country')}
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
