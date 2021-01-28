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
  Client, Contract, ProductInstance, ProductInstanceParams, ProductInstanceStatus,
} from '../clients/server.generated';
import { fetchSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ProductInstanceProps from '../components/product/ProductInstanceProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';

interface SelfProps extends RouteComponentProps<{contractId: string, productInstanceId?: string}> {
  create?: boolean;
}

interface Props extends SelfProps {
  productInstance: ProductInstance | undefined;
  status: ResourceStatus;
  fetchContract: (id: number) => void;
}

class ProductInstanceModal extends React.Component<Props> {
  close = () => {
    const { contractId } = this.props.match.params;
    this.props.fetchContract(parseInt(contractId, 10));
    this.props.history.goBack();
  };

  saveProductInstance = async (productInstance: ProductInstanceParams) => {
    const client = new Client();
    await client.updateProductInstance(parseInt(this.props.match.params.contractId!, 10),
      parseInt(this.props.match.params.productInstanceId!, 10), productInstance);
    this.close();
  };

  createProductInstance = async (productInstance: ProductInstanceParams) => {
    const client = new Client();
    await client.addProduct(parseInt(this.props.match.params.contractId!, 10), productInstance);
    this.close();
  };

  public render() {
    let productInstance: ProductInstance | undefined;
    if (this.props.create) {
      const { contractId } = this.props.match.params;
      productInstance = {
        id: 0,
        contractId: parseInt(contractId, 10),
        productId: 0,
        basePrice: 0,
        discount: 0,
        comments: '',
        status: ProductInstanceStatus.NOTDELIVERED,
      } as any as ProductInstance;
    } else {
      productInstance = this.props.productInstance;
    }

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
          <ProductInstanceProps
            productInstance={productInstance}
            status={this.props.status}
            create={this.props.create}
            onCancel={this.close}
            saveProductInstance={this.saveProductInstance}
            createProductInstance={this.createProductInstance}
          />
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState, props: SelfProps) => {
  return {
    productInstance: !props.create
      ? getSingle<Contract>(state, SingleEntities.Contract).data?.products.find(
        (p) => p.id === parseInt(props.match.params.productInstanceId!, 10),
      )
      : undefined,
    status: getSingle<Contract>(state, SingleEntities.Contract).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContract: (id: number) => dispatch(fetchSingle(SingleEntities.Contract, id)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductInstanceModal));
