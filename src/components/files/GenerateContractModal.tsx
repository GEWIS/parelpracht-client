import React, { ChangeEvent, useState } from 'react';
import {
  Button, Checkbox, Dropdown, Form, Icon, Input, Modal, Segment,
} from 'semantic-ui-react';
import validator from 'validator';
import {
  ContractType, GenerateContractParams, Language, ReturnFileType,
} from '../../clients/server.generated';
import AlertContainer from '../alerts/AlertContainer';
import UserSelector from '../user/UserSelector';
import { FilesClient } from '../../clients/filesClient';

interface Props {
  contractId: number;
  fetchContract: (id: number) => void;
}

function GenerateContractModal(props: Props) {
  const [isOpen, setOpen] = useState(false);

  const [name, changeName] = useState('');
  const [language, changeLanguage] = useState(Language.DUTCH);
  const [contentType, changeContentType] = useState(ContractType.CONTRACT);
  const [fileType, changeFileType] = useState(ReturnFileType.PDF);
  const [showDiscountPercentages, changeDiscount] = useState(true);
  const [saveToDisk, changeSaveToDisk] = useState(false);
  const [signee1Id, changeSignee1] = useState(0);
  const [signee2Id, changeSignee2] = useState(0);
  const [loading, changeLoading] = useState(false);

  const setContentType = (newType: ContractType) => {
    changeContentType(newType);
    if (newType === ContractType.PROPOSAL) {
      changeSignee1(0);
      changeSignee2(0);
    }
  };

  const save = async () => {
    changeLoading(true);
    const client = new FilesClient();
    await client.generateContractFile(props.contractId, new GenerateContractParams({
      name,
      language,
      contentType,
      fileType,
      showDiscountPercentages,
      saveToDisk,
      signee1Id,
      signee2Id,
    }));
    setOpen(false);
    changeLoading(false);
    props.fetchContract(props.contractId);
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
              control={Input}
              required
              error={
                validator.isEmpty(name)
              }
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => changeName(e.target.value)}
              fluid
            />
            <Form.Field
              required
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-Content-Type">Content Type</label>
              <Dropdown
                id="form-input-Content-Type"
                selection
                placeholder="Content Type"
                value={contentType}
                options={[
                  { key: 0, text: 'Contract', value: ContractType.CONTRACT },
                  { key: 1, text: 'Proposal', value: ContractType.PROPOSAL },
                ]}
                onChange={(e, data) => setContentType(data.value as ContractType)}
                fluid
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
          <Form.Group widths="equal">
            <Form.Field
              label="Signee 1"
              placeholder="Signee 1"
              control={UserSelector}
              value={signee1Id}
              required={contentType === ContractType.CONTRACT}
              disabled={contentType !== ContractType.CONTRACT}
              onChange={(id: number) => changeSignee1(id)}
              hideEmail
              correct={contentType === ContractType.PROPOSAL}
              fluid
            />
            <Form.Field
              label="Signee 2"
              placeholder="Signee 2"
              control={UserSelector}
              required={contentType === ContractType.CONTRACT}
              disabled={contentType !== ContractType.CONTRACT}
              value={signee2Id}
              onChange={(id: number) => changeSignee2(id)}
              hideEmail
              correct={contentType === ContractType.PROPOSAL}
              fluid
            />
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

export default GenerateContractModal;
