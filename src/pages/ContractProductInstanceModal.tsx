import * as React from 'react';
import {
  Dimmer, Loader, Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Contract, ProductInstance, ProductInstanceParams, ProductInstanceStatus,
} from '../clients/server.generated';
import { fetchSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ProductInstanceProps from '../components/product/ProductInstanceProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import FinancialDocumentProgress from '../components/activities/FinancialDocumentProgress';
import { GeneralActivity } from '../components/activities/GeneralActivity';
import ActivitiesList from '../components/activities/ActivitiesList';
import {
  createInstanceSingle,
  deleteInstanceSingle,
  saveInstanceSingle,
} from '../stores/productinstance/actionCreator';

interface SelfProps extends RouteComponentProps<{
  contractId: string, productInstanceId?: string
}> {
  create?: boolean;
}

interface Props extends SelfProps {
  productInstance: ProductInstance | undefined;
  status: ResourceStatus;
  contract?: Contract;

  fetchContract: (id: number) => void;
  saveProductInstance: (contractId: number, id: number, inst: ProductInstanceParams) => void;
  createProductInstance: (contractId: number, inst: ProductInstanceParams) => void;
  removeProductInstance: (contractId: number, id: number) => void;
}

class ProductInstanceModal extends React.Component<Props> {
  close = () => {
    const { contractId } = this.props.match.params;
    this.props.fetchContract(parseInt(contractId, 10));
    this.props.history.goBack();
  };

  saveProductInstance = async (productInstance: ProductInstanceParams) => {
    this.props.saveProductInstance(
      parseInt(this.props.match.params.contractId!, 10),
      parseInt(this.props.match.params.productInstanceId!, 10),
      productInstance,
    );
    this.close();
  };

  createProductInstance = async (productInstance: ProductInstanceParams) => {
    this.props.createProductInstance(
      parseInt(this.props.match.params.contractId!, 10),
      productInstance,
    );
    this.close();
  };

  removeProductInstance = async () => {
    this.props.removeProductInstance(
      parseInt(this.props.match.params.contractId!, 10),
      parseInt(this.props.match.params.productInstanceId!, 10),
    );
    this.close();
  };

  public render() {
    const { create, status, contract } = this.props;
    let productInstance: ProductInstance | undefined;
    if (create) {
      const { contractId } = this.props.match.params;
      productInstance = {
        id: -1,
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

    let activities;
    if (!create) {
      activities = [
        <Segment secondary style={{ margin: '2em 1em 1em' }}>
          <FinancialDocumentProgress
            documentId={productInstance.id}
            parentId={productInstance.contractId}
            activities={productInstance.activities as GeneralActivity[]}
            documentType={SingleEntities.ProductInstance}
            resourceStatus={status}
          />
        </Segment>,
        <Segment style={{ margin: '2em 1em 1em' }}>
          <ActivitiesList
            activities={productInstance.activities as GeneralActivity[]}
            componentId={productInstance.id}
            componentType={SingleEntities.ProductInstance}
            resourceStatus={status}
            parentId={productInstance.contractId}
          />
        </Segment>,
      ];
    }

    return (
      <Modal
        onClose={this.close}
        open
        closeIcon
        dimmer="blurring"
        size={create ? 'tiny' : 'large'}
      >
        <div style={{ margin: '1em' }}>
          <AlertContainer />
          <ProductInstanceProps
            productInstance={productInstance}
            contract={contract!}
            status={status}
            create={create}
            onCancel={this.close}
            saveProductInstance={this.saveProductInstance}
            createProductInstance={this.createProductInstance}
            removeProductInstance={this.removeProductInstance}
          />
        </div>
        {activities}
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
    contract: getSingle<Contract>(state, SingleEntities.Contract).data,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContract: (id: number) => dispatch(fetchSingle(SingleEntities.Contract, id)),
  saveProductInstance: (contractId: number, id: number, inst: ProductInstanceParams) => dispatch(
    saveInstanceSingle(contractId, id, inst),
  ),
  createProductInstance: (contractId: number, inst: ProductInstanceParams) => dispatch(
    createInstanceSingle(contractId, inst),
  ),
  removeProductInstance: (contractId: number, id: number) => dispatch(
    deleteInstanceSingle(contractId, id),
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductInstanceModal));
