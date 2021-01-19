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
  Client, Contract, ContractStatusParams,
} from '../clients/server.generated';
import { fetchSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ContractStatusProps from '../components/activities/ContractStatusProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import { getContractStatus } from '../helpers/activity';

interface SelfProps extends RouteComponentProps<{contractId: string, statusName: string;}> {
  create?: boolean;
}

interface Props extends SelfProps {
  resourceStatus: ResourceStatus;
  fetchContract: (id: number) => void;
}

class ContractStatusModal extends React.Component<Props> {
  close = () => {
    const { contractId } = this.props.match.params;
    this.props.fetchContract(parseInt(contractId, 10));
    this.props.history.goBack();
  };

  addContractStatus = async (contractStatusParams: ContractStatusParams) => {
    const client = new Client();
    await client.addContractStatus(
      parseInt(this.props.match.params.contractId!, 10),
      contractStatusParams,
    );
    this.close();
  };

  public render() {
    const { contractId, statusName } = this.props.match.params;
    let contractStatusParams: ContractStatusParams | undefined;
    if (this.props.create) {
      contractStatusParams = {
        description: '',
        subType: getContractStatus(statusName.toUpperCase()),
      } as any as ContractStatusParams;
    }

    if (contractStatusParams === undefined) {
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
          <ContractStatusProps
            contractStatusParams={contractStatusParams}
            contractId={parseInt(contractId, 10)}
            resourceStatus={this.props.resourceStatus}
            create={this.props.create}
            onCancel={() => {
              this.props.history.goBack();
            }}
            addContractStatus={this.addContractStatus}
          />
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    resourceStatus: getSingle<Contract>(state, SingleEntities.Contract).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContract: (id: number) => dispatch(fetchSingle(SingleEntities.Contract, id)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContractStatusModal));
