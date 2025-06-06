import {
  Dimmer, Loader, Modal, Segment,
} from 'semantic-ui-react';
import {
  ContractStatus,
  ContractStatusParams,
  InvoiceStatus,
  InvoiceStatusParams,
} from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import AlertContainer from '../alerts/AlertContainer';
import { SingleEntities } from '../../stores/single/single';
import DocumentStatusProps from './DocumentStatusProps';
import { DocumentStatus } from './DocumentStatus';

interface Props {
  resourceStatus: ResourceStatus;
  close: () => void;

  open: boolean;
  documentId: number;
  documentType: SingleEntities;
  documentStatus: DocumentStatus;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;
}

function DocumentStatusModal({ resourceStatus, documentId, documentType, documentStatus, open, close, parentId}: Props) {
  let documentStatusParams: InvoiceStatusParams | ContractStatusParams | undefined;
  if (documentType === SingleEntities.Contract) {
    documentStatusParams = {
      description: '',
      subType: documentStatus as unknown as ContractStatus,
    } as ContractStatusParams;
  } else {
    documentStatusParams = {
      description: '',
      subType: documentStatus as unknown as InvoiceStatus,
    } as InvoiceStatusParams;
  }

  if (documentStatusParams === undefined) {
    return (
      <Modal
        onClose={() => close()}
        closeIcon
        open={open}
        dimmer="blurring"
        size="tiny"
      >
        <Segment placeholder attached="bottom">
          <AlertContainer />
          <Dimmer active inverted>
            <Loader />
          </Dimmer>
        </Segment>
      </Modal>
    );
  }

  return (
    <Modal
      onClose={() => close()}
      open={open}
      closeIcon
      dimmer="blurring"
      size="tiny"
    >
      <Segment attached="bottom">
        <AlertContainer />
        <DocumentStatusProps
          documentStatusParams={documentStatusParams}
          documentId={documentId}
          documentType={documentType}
          documentStatus={documentStatus}
          resourceStatus={resourceStatus}
          create
          close={close}
          parentId={parentId}
        />
      </Segment>
    </Modal>
  );
}

export default DocumentStatusModal;
