import React, { ChangeEvent, useState } from 'react';
import {
  Button,
  Dropdown, Form, Icon, Input, Modal, Segment,
} from 'semantic-ui-react';
import {
  Language, ReturnFileType, GenerateInvoiceParams,
} from '../../clients/server.generated';
import AlertContainer from '../alerts/AlertContainer';
import { FilesClient } from '../../clients/filesClient';
import ContactSelector from '../contact/ContactSelector';

interface Props {
  invoiceId: number;
  fetchInvoice: (id: number) => void;
}

function GenerateContract(props: Props) {
  const [isOpen, setOpen] = useState(false);

  const [name, changeName] = useState('');
  const [language, changeLanguage] = useState(Language.DUTCH);
  const [fileType, changeFileType] = useState(ReturnFileType.PDF);
  const [showDiscountPercentages, changeDiscount] = useState(true);
  const [saveToDisk, changeSaveToDisk] = useState(false);
  const [recipientId, changeRecipient] = useState(0);
  const [loading, changeLoading] = useState(false);

  const save = async () => {
    changeLoading(true);
    const client = new FilesClient();
    await client.generateInvoiceFile(props.invoiceId, new GenerateInvoiceParams({
      name,
      language,
      fileType,
      showDiscountPercentages,
      saveToDisk,
      recipientId,
    }));
    setOpen(false);
    changeLoading(false);
    props.fetchInvoice(props.invoiceId);
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      closeIcon
      open={isOpen}
      dimmer="blurring"
      size="tiny"
      trigger={(
        <Button
          icon
          loading={loading}
          labelPosition="left"
          floated="right"
          style={{ marginTop: '-0.5em' }}
          basic
        >
          <Icon name="plus" />
          Generate File
        </Button>
      )}
    >
      <Segment attached="bottom">
        <AlertContainer />
        <h2>
          Generate file
          <Button
            primary
            onClick={save}
            floated="right"
            loading={loading}
          >
            Generate
          </Button>
        </h2>
        <Form style={{ marginTop: '2em' }}>
          <Form.Group>
            <Form.Field
              label="Name"
              control={Input}
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => changeName(e.target.value)}
              width={7}
            />
            <Form.Field>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-language">Language</label>
              <Dropdown
                id="form-input-language"
                selection
                placeholder="Language"
                value={language}
                options={[
                  { key: 0, text: 'Dutch', value: Language.DUTCH },
                  { key: 1, text: 'English', value: Language.ENGLISH },
                ]}
                onChange={(e, data) => changeLanguage(data.value as Language)}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-Discount">Show Discount</label>
              <Dropdown
                id="form-input-Discount"
                selection
                placeholder="Show Discount"
                value={showDiscountPercentages}
                options={[
                  { key: 0, text: 'True', value: true },
                  { key: 1, text: 'False', value: false },
                ]}
                onChange={(e, data) => changeDiscount(data.value as boolean)}
              />
            </Form.Field>
            <Form.Field>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-SaveToDisk">Save To Disk</label>
              <Dropdown
                id="form-input-SaveToDisk"
                selection
                placeholder="Save To Disk"
                value={saveToDisk}
                options={[
                  { key: 0, text: 'True', value: true },
                  { key: 1, text: 'False', value: false },
                ]}
                onChange={(e, data) => changeSaveToDisk(data.value as boolean)}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-File-Type">File Type</label>
              <Dropdown
                id="form-input-File-Type"
                selection
                placeholder="File Type"
                value={fileType}
                options={[
                  { key: 0, text: 'PDF', value: ReturnFileType.PDF },
                  { key: 1, text: 'TEX', value: ReturnFileType.TEX },
                ]}
                onChange={(e, data) => changeFileType(data.value as ReturnFileType)}
              />
            </Form.Field>
            <Form.Field
              label="Recipient"
              placeholder="Recipient"
              control={ContactSelector}
              value={recipientId}
              onChange={(id: number) => changeRecipient(id)}
              hideEmail
            />
          </Form.Group>
        </Form>
      </Segment>
    </Modal>
  );
}

export default GenerateContract;
