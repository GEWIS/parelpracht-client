import * as React from 'react';
import {
  Dimmer, Loader, Modal, Segment,
} from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
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

interface Props extends RouteComponentProps {
  resourceStatus: ResourceStatus;
  close: () => void;

  open: boolean;
  documentId: number;
  documentType: SingleEntities;
  documentStatus: DocumentStatus;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;
}

class DocumentStatusModal extends React.Component<Props> {
  static defaultProps = {
    parentId: undefined,
  };

  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const {
      documentId,
      documentType,
      documentStatus,
      open,
      close,
      parentId,
    } = this.props;
    let documentStatusParams: InvoiceStatusParams | ContractStatusParams | undefined;
    if (documentType === SingleEntities.Contract) {
      documentStatusParams = {
        description: '',
        subType: documentStatus as any as ContractStatus,
      } as any as ContractStatusParams;
    } else {
      documentStatusParams = {
        description: '',
        subType: documentStatus as any as InvoiceStatus,
      } as any as InvoiceStatusParams;
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
            resourceStatus={this.props.resourceStatus}
            create
            close={close}
            parentId={parentId}
          />
        </Segment>
      </Modal>
    );
  }
}

export default withRouter(DocumentStatusModal);
