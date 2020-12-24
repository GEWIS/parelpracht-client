import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb,
  Container, Grid, Loader, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Contract } from '../clients/server.generated';
import { fetchSingleContract, clearSingleContract } from '../stores/contract/actionCreators';
import { RootState } from '../stores/store';
import ContractProps from '../components/contract/ContractProps';
import ResourceStatus from '../stores/resourceStatus';
import ContractSummary from '../components/contract/ContractSummary';

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
    contract: state.contract.single,
    status: state.contract.singleStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContract: (id: number) => dispatch(fetchSingleContract(id)),
  clearContract: () => dispatch(clearSingleContract()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleContractPage));
