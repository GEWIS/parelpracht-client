import * as React from 'react';
import {
  Dimmer,
  Loader,
  Modal, Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Contract, Invoice, ProductInstance,
} from '../clients/server.generated';
import { RootState } from '../stores/store';
import InvoiceProductInstanceProps from '../components/invoice/InvoiceProductInstanceProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';

interface SelfProps extends RouteComponentProps<{invoiceId: string, productInstanceId?: string}> {
  create?: boolean;
}

interface Props extends SelfProps {
  productInstance: ProductInstance | undefined;
  status: ResourceStatus;
  // fetchInvoice: (id: number) => void;
}

class InvoiceProductInstanceModal extends React.Component<Props> {
  close = () => {
    this.props.history.goBack();
  };

  public render() {
    const { productInstance } = this.props;

    if (productInstance === undefined) {
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
          <InvoiceProductInstanceProps
            productInstance={productInstance}
            status={this.props.status}
            create={false}
            onCancel={() => { }}
            saveProductInstance={() => { }}
            createProductInstance={() => { }}
          />
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState, props: SelfProps) => {
  return {
    productInstance: !props.create
      ? getSingle<Invoice>(state, SingleEntities.Invoice).data?.products.find(
        (p) => p.id === parseInt(props.match.params.productInstanceId!, 10),
      )
      : undefined,
    status: getSingle<Contract>(state, SingleEntities.Contract).status,
  };
};

// eslint-disable-next-line max-len
export default withRouter(connect(mapStateToProps)(InvoiceProductInstanceModal));
