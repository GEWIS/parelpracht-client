import { useState } from 'react';
import { Form } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { ContractStatus, InvoiceStatus, ProductInstanceStatus } from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import PropsButtons from '../PropsButtons';
import { SingleEntities } from '../../stores/single/single';
import TextArea from '../TextArea';

const DEFAULT_DESCRIPTION = '';

interface Props<T extends ContractStatus | InvoiceStatus | ProductInstanceStatus> {
  /**
   * The status this modal will represent
   */
  documentStatus: T;
  /**
   * The status in human-readable, translated format
   */
  documentStatusText: string;
  /**
   * The original description as stored in the database. Undefined if the status does not exist
   */
  originalDescription?: string | undefined;

  /**
   * Status of the entity in the store
   */
  resourceStatus: ResourceStatus;
  onSave: (documentStatus: T, description: string) => void;
}

function FinancialDocumentStatusProps<T extends ContractStatus | InvoiceStatus | ProductInstanceStatus>({
  documentStatus,
  documentStatusText,
  originalDescription,
  resourceStatus,
  onSave: onSaveCallback,
}: Props<T>) {
  const creating = () => originalDescription === undefined;

  const [editing, setEditing] = useState(creating());
  const [description, setDescription] = useState<string>(originalDescription ?? DEFAULT_DESCRIPTION);

  const { t } = useTranslation();

  const onCancel = () => {
    setEditing(false);
    setDescription(DEFAULT_DESCRIPTION);
  };

  const onSave = () => {
    onSaveCallback(documentStatus, description);
  };

  return (
    <>
      <h2>
        {/*{creating() ? `Post ${formatStatus(documentStatus)} Status` : `${formatStatus(documentStatus)} Details} `}*/}
        {creating()
          ? t(`activities.status.headerCreate`, { status: documentStatusText })
          : t(`activities.status.headerUpdate`, { status: documentStatusText })}

        <PropsButtons
          editing={editing}
          canDelete={undefined}
          canEdit
          canSave
          entity={SingleEntities.Contract}
          status={resourceStatus}
          cancel={onCancel}
          edit={() => setEditing(true)}
          save={onSave}
          remove={() => {}}
        />
      </h2>

      <Form style={{ marginTop: '2em' }}>
        <Form.Field>
          <label htmlFor="form-input-description">Comments</label>
          <TextArea
            id="form-delivery-spec-english"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comments"
          />
        </Form.Field>
      </Form>
    </>
  );
}

export default FinancialDocumentStatusProps;
