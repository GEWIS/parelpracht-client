import { Modal, Segment } from 'semantic-ui-react';
import { DocumentStatus, FinancialDocumentActivity } from '../../helpers/activity';
import AlertContainer from '../alerts/AlertContainer';
import ResourceStatus from '../../stores/resourceStatus';
import FinancialDocumentStatusProps from './FinancialDocumentStatusProps';

interface Props<R extends FinancialDocumentActivity, T extends DocumentStatus<R> = DocumentStatus<R>> {
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
   * Whether the modal is open
   */
  open: boolean;
  /**
   * Status of the entity in the store
   */
  resourceStatus: ResourceStatus;

  onClose: () => void;
  onSave: (documentStatus: T, description: string) => void;
}

function FinancialDocumentStatusModal<T extends FinancialDocumentActivity>({
  documentStatus,
  documentStatusText,
  open,
  originalDescription,
  resourceStatus,
  onClose,
  onSave,
}: Props<T>) {
  return (
    <Modal onClose={() => onClose()} open={open} closeIcon dimmer="blurring" size="tiny">
      <Segment attached="bottom">
        <AlertContainer />
        <FinancialDocumentStatusProps
          documentStatus={documentStatus}
          documentStatusText={documentStatusText}
          originalDescription={originalDescription}
          onSave={onSave}
          resourceStatus={resourceStatus}
        />
      </Segment>
    </Modal>
  );
}

export default FinancialDocumentStatusModal;
