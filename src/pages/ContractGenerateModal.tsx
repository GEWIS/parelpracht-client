import React, { ChangeEvent, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  Button,
  Dimmer, Dropdown, Form, Input, Loader, Modal, Segment,
} from 'semantic-ui-react';
import {
  ContractFile, Language, ContractType, ReturnFileType, Contract, Client, GenerateContractParams,
} from '../clients/server.generated';
import AlertContainer from '../components/alerts/AlertContainer';
import ResourceStatus from '../stores/resourceStatus';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import { RootState } from '../stores/store';
import UserSelector from '../components/user/UserSelector';
import PropsButtons from '../components/PropsButtons';

interface Props {
  contractId: number;
}

function SingleContractPage(props: Props) {
  const [isOpen, setOpen] = useState(false);

  const [name, changeName] = useState('');
  const [language, changeLanguage] = useState(Language.DUTCH);
  const [contentType, changeContentType] = useState(ContractType.CONTRACT);
  const [fileType, changeFileType] = useState(ReturnFileType.PDF);
  const [showDiscountPercentages, changeDiscount] = useState(true);
  const [saveToDisk, changeSaveToDisk] = useState(false);
  const [signee1Id, changeSignee1] = useState(0);
  const [signee2Id, changeSignee2] = useState(0);

  const save = async () => {
    const client = new Client();
    await client.generateFile(props.contractId, new GenerateContractParams({
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
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      closeIcon
      open={isOpen}
      dimmer="blurring"
      size="tiny"
      trigger={<Button> Generate </Button>}
    >
      <Segment attached="bottom">
        <AlertContainer />
        <h2>
          Generate file
          <Button onClick={save}>
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
                onChange={(e, data) => changeContentType(data.value as ContractType)}
              />
            </Form.Field>
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
            <Form.Field
              label="Signee 1"
              control={UserSelector}
              value={signee1Id}
              onChange={(id: number) => changeSignee1(id)}
              hideEmail
            />
            <Form.Field
              label="Signee 2"
              control={UserSelector}
              value={signee2Id}
              onChange={(id: number) => changeSignee2(id)}
              hideEmail
            />
          </Form.Group>
        </Form>
      </Segment>
    </Modal>
  );
}

export default SingleContractPage;
