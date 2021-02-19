import React, { ChangeEvent, useState } from 'react';
import {
  Button,
  Checkbox,
  Dropdown, Form, Icon, Input, Modal, Segment,
} from 'semantic-ui-react';
import validator from 'validator';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  Language, ReturnFileType, GenerateInvoiceParams, Invoice, ContractType,
} from '../../clients/server.generated';
import AlertContainer from '../alerts/AlertContainer';
import { FilesClient } from '../../clients/filesClient';
import ContactSelector from '../contact/ContactSelector';
import { TransientAlert } from '../../stores/alerts/actions';
import { showTransientAlert } from '../../stores/alerts/actionCreators';

interface Props {
  invoice: Invoice;
  fetchInvoice: (id: number) => void;
  showTransientAlert: (alert: TransientAlert) => void;
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
    const success = await client.generateInvoiceFile(props.invoice.id, new GenerateInvoiceParams({
      name,
      language,
      fileType,
      showDiscountPercentages,
      saveToDisk,
      recipientId,
    }));
    changeLoading(false);

    if (success) {
      setOpen(false);
      props.fetchInvoice(props.invoice.id);
    } else {
      props.showTransientAlert({
        title: 'Error',
        message: 'Could not generate an invoice file. Please consulate the back-end logs.',
        type: 'error',
      });
    }
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
            onClick={save}
            floated="right"
            loading={loading}
            color="green"
            icon
            labelPosition="left"
            disabled={validator.isEmpty(name) || recipientId === 0}
          >
            <Icon name="download" />
            Generate
          </Button>
          <Button
            icon
            floated="right"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </h2>
        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field
              label="Label"
              required
              error={
                validator.isEmpty(name)
              }
              control={Input}
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => changeName(e.target.value)}
              fluid
            />
            <Form.Field required>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-contact-selector">Recipient</label>
              <ContactSelector
                id="form-contact-selector"
                disabled={false}
                companyId={props.invoice.companyId}
                value={recipientId}
                onChange={(id: number) => changeRecipient(id)}
                placeholder="Recipient"
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
            >
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
                fluid
              />
            </Form.Field>
            <Form.Field
              required
            >
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
                fluid
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-Discount">Show Discount</label>
              <Checkbox
                toggle
                defaultChecked
                id="form-input-Discount"
                checked={showDiscountPercentages}
                onChange={(e, data) => changeDiscount(data.checked as boolean)}
                fluid
              />
            </Form.Field>
            <Form.Field>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-SaveToDisk">Save To Disk</label>
              <Checkbox
                id="form-input-SaveToDisk"
                toggle
                defaultChecked
                checked={saveToDisk}
                onChange={(e, data) => changeSaveToDisk(data.checked as boolean)}
                fluid
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </Segment>
    </Modal>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default connect(null, mapDispatchToProps)(GenerateContract);
