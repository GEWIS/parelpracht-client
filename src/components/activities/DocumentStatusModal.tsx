import * as React from 'react';
import {
  Dimmer, Loader, Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  ContractStatus,
  ContractStatusParams,
  InvoiceStatus,
  InvoiceStatusParams,
} from '../../clients/server.generated';
import { fetchSingle } from '../../stores/single/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import AlertContainer from '../alerts/AlertContainer';
import { SingleEntities } from '../../stores/single/single';
import DocumentStatusProps from './DocumentStatusProps';
import { DocumentStatus } from './DocumentStatus';

interface Props extends RouteComponentProps {
  resourceStatus: ResourceStatus;
  fetchInvoice: (id: number) => void;
  fetchContract: (id: number) => void;
  close: () => void;

  open: boolean;
  documentId: number;
  documentType: SingleEntities;
  documentStatus: DocumentStatus;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;
}

class DocumentStatusModal extends React.Component<Props> {
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchInvoice: (id: number) => dispatch(fetchSingle(SingleEntities.Invoice, id)),
  fetchContract: (id: number) => dispatch(fetchSingle(SingleEntities.Contract, id)),
});

export default withRouter(connect(mapDispatchToProps)(DocumentStatusModal));
