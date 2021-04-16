import React, { ChangeEvent } from 'react';
import {
  Dropdown, Form, Input, Segment,
} from 'semantic-ui-react';
import validator from 'validator';
import { Language, ReturnFileType } from '../../clients/server.generated';

interface Props {
  language: Language;
  fileType: ReturnFileType;
  subject: string;
  ourReference: string;
  theirReference: string;

  setAttribute: (attribute: string, value: string) => void;
  setLanguage: (language: Language) => void;
  setFileType: (type: ReturnFileType) => void;
}

function CustomInvoiceProps(props: Props) {
  return (
    <Segment secondary style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'black' }}>
      <h2>Invoice details</h2>
      <Form style={{ marginTop: '2em' }}>
        <Form.Group widths="equal">
          <Form.Field
            required
            id="form-invoice-subject"
            fluid
            control={Input}
            label="Subject"
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
            <label htmlFor="form-invoice-File-Type">File Type</label>
            <Dropdown
              id="form-invoice-File-Type"
              selection
              placeholder="File Type"
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
            <label htmlFor="form-invoice-language">Language</label>
            <Dropdown
              id="form-invoice-language"
              selection
              placeholder="Language"
              value={props.language}
              options={[
                { key: 0, text: 'Dutch', value: Language.DUTCH },
                { key: 1, text: 'English', value: Language.ENGLISH },
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
            label="Our reference"
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
            label="Their reference"
            value={props.theirReference}
            onChange={(e: ChangeEvent<HTMLInputElement>) => props.setAttribute(
              'theirReference', e.target.value,
            )}
          />
        </Form.Group>
      </Form>
    </Segment>
  );
}

export default CustomInvoiceProps;
