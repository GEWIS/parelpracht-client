import * as React from 'react';
import {
  Dimmer,
  Loader,
  Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Client, Invoice, InvoiceStatusParams,
} from '../clients/server.generated';
import { fetchSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import InvoiceStatusProps from '../components/activities/InvoiceStatusProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import { getInvoiceStatus } from '../helpers/activity';

interface SelfProps extends RouteComponentProps<{invoiceId: string, statusName: string;}> {
  create?: boolean;
}

interface Props extends SelfProps {
  resourceStatus: ResourceStatus;
  fetchInvoice: (id: number) => void;
}

class InvoiceStatusModal extends React.Component<Props> {
  close = () => {
    const { invoiceId } = this.props.match.params;
    this.props.fetchInvoice(parseInt(invoiceId, 10));
    this.props.history.goBack();
  };

  addInvoiceStatus = async (invoiceStatusParams: InvoiceStatusParams) => {
    const client = new Client();
    await client.addInvoiceStatus(
      parseInt(this.props.match.params.invoiceId!, 10),
      invoiceStatusParams,
    );
    this.close();
  };

  public render() {
    const { invoiceId, statusName } = this.props.match.params;
    let invoiceStatusParams: InvoiceStatusParams | undefined;
    if (this.props.create) {
      invoiceStatusParams = {
        description: '',
        subType: getInvoiceStatus(statusName.toUpperCase()),
      } as any as InvoiceStatusParams;
    }

    if (invoiceStatusParams === undefined) {
      return (
        <Modal
          onClose={this.close}
          closeIcon
          open
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
        onClose={this.close}
        open
        closeIcon
        dimmer="blurring"
        size="tiny"
      >
        <Segment attached="bottom">
          <AlertContainer />
          <InvoiceStatusProps
            invoiceStatusParams={invoiceStatusParams}
            invoiceId={parseInt(invoiceId, 10)}
            resourceStatus={this.props.resourceStatus}
            create={this.props.create}
            onCancel={() => {
              this.close();
            }}
            addInvoiceStatus={this.addInvoiceStatus}
          />
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    resourceStatus: getSingle<Invoice>(state, SingleEntities.Invoice).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchInvoice: (id: number) => dispatch(fetchSingle(SingleEntities.Invoice, id)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InvoiceStatusModal));
