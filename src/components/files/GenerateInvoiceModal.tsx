import { ChangeEvent, useState } from 'react';
import {
  Button,
  Checkbox,
  Dropdown, Form, Icon, Input, Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Language, ReturnFileType, GenerateInvoiceParams, Invoice,
} from '../../clients/server.generated';
import AlertContainer from '../alerts/AlertContainer';
import { FilesClient } from '../../clients/filesClient';
import ContactSelector from '../entities/contact/ContactSelector';
import { TransientAlert } from '../../stores/alerts/actions';
import { showTransientAlert } from '../../stores/alerts/actionCreators';

interface Props {
  invoice: Invoice;
  fetchInvoice: (id: number) => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

function GenerateContract(props: Props) {
  const { t } = useTranslation();

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
        message: t('files.generate.error', { entity: t('entity.invoice').toLowerCase() }),
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
          {t('files.generate.header')}
        </Button>
      )}
    >
      <Segment attached="bottom">
        <AlertContainer />
        <h2>
          {t('files.generate.header')}
          <Button
            onClick={() => { save().catch(console.error); }}
            floated="right"
            loading={loading}
            color="green"
            icon
            labelPosition="left"
            disabled={recipientId === 0}
          >
            <Icon name="download" />
            {t('files.generate.generateButton')}
          </Button>
          <Button
            icon
            floated="right"
            onClick={() => setOpen(false)}
          >
            {t('buttons.cancel')}
          </Button>
        </h2>
        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field required>
                            <label htmlFor="form-contact-selector">{t('files.generate.recipient')}</label>
              <ContactSelector
                id="form-contact-selector"
                disabled={false}
                companyId={props.invoice.companyId}
                value={recipientId}
                onChange={(id: number) => changeRecipient(id)}
                placeholder={t('files.generate.recipient')}
              />
            </Form.Field>
            <Form.Field
              label={t('files.generate.label')}
              control={Input}
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => changeName(e.target.value)}
              fluid
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              required
            >
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
            <Form.Field
              required
            >
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

export default connect(null, mapDispatchToProps)(GenerateContract);
