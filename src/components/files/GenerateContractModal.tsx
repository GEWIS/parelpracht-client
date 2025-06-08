import React, { ChangeEvent, useState } from 'react';
import { Button, Checkbox, Dropdown, Form, Icon, Input, Modal, Segment } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Contract,
  ContractType,
  GenerateContractParams,
  Language,
  ReturnFileType,
  Roles,
} from '../../clients/server.generated';
import AlertContainer from '../alerts/AlertContainer';
import UserSelector from '../entities/user/UserSelector';
import { FilesClient } from '../../clients/filesClient';
import { TransientAlert } from '../../stores/alerts/actions';
import { showTransientAlert } from '../../stores/alerts/actionCreators';
import ContactSelector from '../entities/contact/ContactSelector';

interface Props {
  contract: Contract;
  fetchContract: (id: number) => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

function GenerateContractModal(props: Props) {
  const { t } = useTranslation();

  const [isOpen, setOpen] = useState(false);

  const [name, changeName] = useState('');
  const [language, changeLanguage] = useState(Language.DUTCH);
  const [contentType, changeContentType] = useState(ContractType.CONTRACT);
  const [fileType, changeFileType] = useState(ReturnFileType.PDF);
  const [showDiscountPercentages, changeDiscount] = useState(true);
  const [saveToDisk, changeSaveToDisk] = useState(false);
  const [recipientId, changeRecipientId] = useState(props.contract.contactId);
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
    const success = await client.generateContractFile(
      props.contract.id,
      new GenerateContractParams({
        name,
        language,
        contentType,
        fileType,
        showDiscountPercentages,
        saveToDisk,
        signee1Id,
        signee2Id,
        recipientId,
      }),
    );
    changeLoading(false);

    if (success) {
      setOpen(false);
      props.fetchContract(props.contract.id);
    } else {
      props.showTransientAlert({
        title: 'Error',
        message: t('files.generate.error', {
          entity:
            contentType === ContractType.CONTRACT
              ? t('files.generate.contract').toLowerCase()
              : t('files.generate.proposal').toLowerCase(),
        }),
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
      trigger={
        <Button icon loading={loading} labelPosition="left" floated="right" style={{ marginTop: '-0.5em' }} basic>
          <Icon name="plus" />
          {t('files.generate.header')}
        </Button>
      }
    >
      <Segment attached="bottom">
        <AlertContainer />
        <h2>
          {t('files.generate.header')}
          <Button
            onClick={() => {
              save().catch(console.error);
            }}
            floated="right"
            loading={loading}
            color="green"
            icon
            labelPosition="left"
            disabled={
              (signee1Id === 0 && contentType === ContractType.CONTRACT) ||
              (signee2Id === 0 && contentType === ContractType.CONTRACT)
            }
          >
            <Icon name="download" />
            {t('files.generate.generateButton')}
          </Button>
          <Button icon floated="right" onClick={() => setOpen(false)}>
            {t('buttons.cancel')}
          </Button>
        </h2>
        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field required>
              <label htmlFor="form-input-Content-Type">{t('files.generate.contentType')}</label>
              <Dropdown
                id="form-input-Content-Type"
                selection
                placeholder="Content Type"
                value={contentType}
                options={[
                  { key: 0, text: t('files.generate.contract'), value: ContractType.CONTRACT },
                  { key: 1, text: t('files.generate.proposal'), value: ContractType.PROPOSAL },
                ]}
                onChange={(_, data) => setContentType(data.value as ContractType)}
                fluid
              />
            </Form.Field>
            <Form.Field required>
              <label htmlFor="form-contact-selector">{t('files.generate.recipient')}</label>
              <ContactSelector
                id="form-contact-selector"
                disabled={false}
                companyId={props.contract.companyId}
                value={recipientId}
                onChange={(id: number) => changeRecipientId(id)}
                placeholder="Recipient"
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              label={t('files.generate.label')}
              control={Input}
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => changeName(e.target.value)}
              fluid
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field required>
              <label htmlFor="form-input-File-Type">{t('files.generate.fileType')}</label>
              <Dropdown
                id="form-input-File-Type"
                selection
                placeholder={t('files.generate.fileType')}
                value={fileType}
                options={[
                  { key: 0, text: 'PDF', value: ReturnFileType.PDF },
                  { key: 1, text: 'TEX', value: ReturnFileType.TEX },
                ]}
                onChange={(_, data) => changeFileType(data.value as ReturnFileType)}
                fluid
              />
            </Form.Field>
            <Form.Field required>
              <label htmlFor="form-input-language">{t('language.header')}</label>
              <Dropdown
                id="form-input-language"
                selection
                placeholder="Language"
                value={language}
                options={[
                  { key: 0, text: t('language.dutch'), value: Language.DUTCH },
                  { key: 1, text: t('language.english'), value: Language.ENGLISH },
                ]}
                onChange={(_, data) => changeLanguage(data.value as Language)}
                fluid
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              label={`${t('files.generate.signee')} 1`}
              placeholder={`${t('files.generate.signee')} 1`}
              control={UserSelector}
              value={signee1Id}
              required={contentType === ContractType.CONTRACT}
              disabled={contentType !== ContractType.CONTRACT}
              onChange={(id: number) => changeSignee1(id)}
              hideEmail
              correct={contentType === ContractType.PROPOSAL}
              fluid
              role={Roles.SIGNEE}
            />
            <Form.Field
              label={`${t('files.generate.signee')} 2`}
              placeholder={`${t('files.generate.signee')} 2`}
              control={UserSelector}
              required={contentType === ContractType.CONTRACT}
              disabled={contentType !== ContractType.CONTRACT}
              value={signee2Id}
              onChange={(id: number) => changeSignee2(id)}
              hideEmail
              correct={contentType === ContractType.PROPOSAL}
              fluid
              role={Roles.SIGNEE}
            />
          </Form.Group>
          <Form.Group>
            <Form.Field>
              <label htmlFor="form-input-Discount">{t('files.generate.showDiscount')}</label>
              <Checkbox
                toggle
                id="form-input-Discount"
                checked={showDiscountPercentages}
                onChange={(_, data) => changeDiscount(data.checked as boolean)}
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor="form-input-SaveToDisk">{t('files.generate.saveToDisk')}</label>
              <Checkbox
                id="form-input-SaveToDisk"
                toggle
                checked={saveToDisk}
                onChange={(_, data) => changeSaveToDisk(data.checked as boolean)}
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

export default connect(null, mapDispatchToProps)(GenerateContractModal);
