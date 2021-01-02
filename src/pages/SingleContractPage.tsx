import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb,
  Container, Grid, Loader, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Contract } from '../clients/server.generated';
import { fetchSingle, clearSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ContractProps from '../components/contract/ContractProps';
import ResourceStatus from '../stores/resourceStatus';
import ContractSummary from '../components/contract/ContractSummary';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import ContractGenerateModal from './ContractGenerateModal';

interface Props extends RouteComponentProps<{ contractId: string }> {
  contract: Contract | undefined;
  status: ResourceStatus;

  fetchContract: (id: number) => void;
  clearContract: () => void;
}

class SingleContractPage extends React.Component<Props> {
  componentDidMount() {
    const { contractId } = this.props.match.params;

    this.props.clearContract();
    this.props.fetchContract(Number.parseInt(contractId, 10));
  }

  public render() {
    const { contract } = this.props;

    if (contract === undefined) {
      return (
        <Container style={{ paddingTop: '2em' }}>
          <Loader content="Loading" active />
        </Container>
      );
    }

    return (
      <Container style={{ paddingTop: '2em' }}>
        <Breadcrumb
          icon="right angle"
          sections={[
            { key: 'Contracts', content: <NavLink to="/contract">Contracts</NavLink> },
            { key: 'Contract', content: contract.title, active: true },
          ]}
        />
        <ContractSummary />
        <Grid columns={2}>
          <Grid.Column>
            <ContractGenerateModal contractId={contract.id} />
            <Segment>
              <ContractProps contract={contract} />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    contract: getSingle<Contract>(state, SingleEntities.Contract).data,
    status: getSingle<Contract>(state, SingleEntities.Contract).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContract: (id: number) => dispatch(fetchSingle(SingleEntities.Contract, id)),
  clearContract: () => dispatch(clearSingle(SingleEntities.Contract)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleContractPage));
