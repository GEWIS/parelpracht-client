import React, { ChangeEvent, useState } from 'react';
import {
  Dropdown, Form, Input, Segment,
} from 'semantic-ui-react';
import validator from 'validator';
import { useTranslation } from 'react-i18next';
import { DateInput } from 'semantic-ui-calendar-react';
import { Language, ReturnFileType } from '../../clients/server.generated';
import { formatDateToString, isInvalidDate } from '../../helpers/timestamp';

interface Props {
  language: Language;
  fileType: ReturnFileType;
  subject: string;
  ourReference: string;
  theirReference: string;
  date: Date;

  setAttribute: (attribute: string, value: string) => void;
  setLanguage: (language: Language) => void;
  setFileType: (type: ReturnFileType) => void;
  setDate: (date: Date) => void;
}

function CustomInvoiceProps(props: Props) {
  const { t } = useTranslation();

  const [dateValue, setDateValue] = useState(formatDateToString(props.date));

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
            value={props.subject}
            onChange={(e: ChangeEvent<HTMLInputElement>) => props.setAttribute(
              'subject', e.target.value,
            )}
            error={validator.isEmpty(props.subject)}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            required
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-invoice-File-Type">{t('files.generate.fileType')}</label>
            <Dropdown
              id="form-invoice-File-Type"
              selection
              placeholder={t('files.generate.fileType')}
              value={props.fileType}
              options={[
                { key: 0, text: 'PDF', value: ReturnFileType.PDF },
                { key: 1, text: 'TEX', value: ReturnFileType.TEX },
              ]}
              onChange={(e, data) => props.setFileType(data.value as ReturnFileType)}
              fluid
            />
          </Form.Field>
          <Form.Field
            required
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-invoice-language">{t('language.header')}</label>
            <Dropdown
              id="form-invoice-language"
              selection
              placeholder={t('files.generate.language')}
              value={props.language}
              options={[
                { key: 0, text: t('language.dutch'), value: Language.DUTCH },
                { key: 1, text: t('language.english'), value: Language.ENGLISH },
              ]}
              onChange={(e, data) => props.setLanguage(data.value as Language)}
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
            value={props.ourReference}
            onChange={(e: ChangeEvent<HTMLInputElement>) => props.setAttribute(
              'ourReference', e.target.value,
            )}
            error={validator.isEmpty(props.ourReference)}
          />
          <Form.Field
            id="form-invoice-their-reference"
            fluid
            control={Input}
            label={t('files.generate.custom.theirReference')}
            value={props.theirReference}
            onChange={(e: ChangeEvent<HTMLInputElement>) => props.setAttribute(
              'theirReference', e.target.value,
            )}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field required>
            <label htmlFor="form-input-date">{t('entities.invoice.props.invoiceDate')}</label>
            <DateInput
              onChange={(e, { value }) => {
                setDateValue(value);
                props.setDate(new Date(value));
              }}
              value={dateValue}
              error={isInvalidDate(props.date)}
              id="form-input-date"
              dateFormat="YYYY-MM-DD"
              fluid
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </Segment>
  );
}

export default CustomInvoiceProps;
