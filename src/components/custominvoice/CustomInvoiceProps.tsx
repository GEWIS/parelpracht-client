import { ChangeEvent } from 'react';
import {
  Dropdown, Form, Input, Segment,
} from 'semantic-ui-react';
import validator from 'validator';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import {ICustomInvoiceGenSettings, Language, ReturnFileType} from '../../clients/server.generated';
import { isInvalidDate } from '../../helpers/timestamp';
import 'react-datepicker/dist/react-datepicker.css';

interface Props<T extends keyof ICustomInvoiceGenSettings = keyof ICustomInvoiceGenSettings> {
  customInvoice: ICustomInvoiceGenSettings;
  setAttribute: (key: T, value: ICustomInvoiceGenSettings[T]) => void;
}

function CustomInvoiceProps({ customInvoice, setAttribute }: Props) {
  const { t } = useTranslation();

  return (
    <Segment secondary style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'black' }}>
      <h2>{t('pages.customInvoice.detailsHeader')}</h2>
      <Form style={{ marginTop: '2em' }}>
        <Form.Group widths="equal">
          <Form.Field
            required
            id="form-invoice-subject"
            fluid
            control={Input}
            label={t('files.generate.custom.subject')}
            value={customInvoice.subject}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAttribute(
              'subject', e.target.value,
            )}
            error={validator.isEmpty(customInvoice.subject)}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            required
          >
                        <label htmlFor="form-invoice-File-Type">{t('files.generate.fileType')}</label>
            <Dropdown
              id="form-invoice-File-Type"
              selection
              placeholder={t('files.generate.fileType')}
              value={customInvoice.fileType}
              options={[
                { key: 0, text: 'PDF', value: ReturnFileType.PDF },
                { key: 1, text: 'TEX', value: ReturnFileType.TEX },
              ]}
              onChange={(_, data) => setAttribute('fileType', data.value as ReturnFileType)}
              fluid
            />
          </Form.Field>
          <Form.Field
            required
          >
                        <label htmlFor="form-invoice-language">{t('language.header')}</label>
            <Dropdown
              id="form-invoice-language"
              selection
              placeholder={t('files.generate.language')}
              value={customInvoice.language}
              options={[
                { key: 0, text: t('language.dutch'), value: Language.DUTCH },
                { key: 1, text: t('language.english'), value: Language.ENGLISH },
              ]}
              onChange={(_, data) => setAttribute('language', data.value as Language)}
              fluid
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            required
            id="form-invoice-our-reference"
            fluid
            control={Input}
            label={t('files.generate.custom.ourReference')}
            value={customInvoice.ourReference}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAttribute(
              'ourReference', e.target.value,
            )}
            error={validator.isEmpty(customInvoice.ourReference)}
          />
          <Form.Field
            id="form-invoice-their-reference"
            fluid
            control={Input}
            label={t('files.generate.custom.theirReference')}
            value={customInvoice.theirReference}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAttribute(
              'theirReference', e.target.value,
            )}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field required error={isInvalidDate(customInvoice.date)}>
            <label htmlFor="form-input-date">{t('entities.invoice.props.invoiceDate')}</label>
            <DatePicker
              onChange={(date) => {
                if (date) setAttribute('date', date);
              }}
              selected={customInvoice.date}
              onChangeRaw={e => e?.preventDefault()}
              id="form-input-date"
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </Segment>
  );
}

export default CustomInvoiceProps;
