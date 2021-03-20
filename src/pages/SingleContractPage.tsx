import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb, Container, Grid, Loader, Segment, Tab,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Contract, Roles } from '../clients/server.generated';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ContractProps from '../components/contract/ContractProps';
import ResourceStatus from '../stores/resourceStatus';
import ContractSummary from '../components/contract/ContractSummary';
import ContractProductList from '../components/contract/ContractProductList';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import ActivitiesList from '../components/activities/ActivitiesList';
import { GeneralActivity } from '../components/activities/GeneralActivity';
import FinancialDocumentProgress from '../components/activities/FinancialDocumentProgress';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import { TransientAlert } from '../stores/alerts/actions';
import FilesList from '../components/files/FilesList';
import GenerateContractModal from '../components/files/GenerateContractModal';
import { authedUserHasRole } from '../stores/auth/selectors';

interface Props extends RouteComponentProps<{ contractId: string }> {
  contract: Contract | undefined;
  status: ResourceStatus;

  fetchContract: (id: number) => void;
  clearContract: () => void;
  showTransientAlert: (alert: TransientAlert) => void;
  hasRole: (role: Roles) => boolean;
}

class SingleContractPage extends React.Component<Props> {
  componentDidMount() {
    const { contractId } = this.props.match.params;

    this.props.clearContract();
    this.props.fetchContract(Number.parseInt(contractId, 10));
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.status === ResourceStatus.EMPTY
      && prevProps.status === ResourceStatus.DELETING
    ) {
      this.props.history.push('/contract');
      this.props.showTransientAlert({
        title: 'Success',
        message: `Contract ${prevProps.contract?.title} successfully deleted`,
        type: 'success',
        displayTimeInMs: 3000,
      });
    }
  }

  public render() {
    const {
      contract, fetchContract, status, hasRole,
    } = this.props;

    if (contract === undefined) {
      return (
        <Container style={{ paddingTop: '2em' }}>
          <Loader content="Loading" active />
        </Container>
      );
    }

    const panes = [
      {
        menuItem: 'Products',
        render: () => (
          <Tab.Pane>
            <ContractProductList
              contract={contract}
            />
          </Tab.Pane>
        ),
      },
    ];

    if (hasRole(Roles.ADMIN) || hasRole(Roles.GENERAL) || hasRole(Roles.AUDIT)) {
      panes.push({
        menuItem: 'Activities',
        render: () => (
          <Tab.Pane>
            <ActivitiesList
              activities={contract.activities as GeneralActivity[]}
              componentId={contract.id}
              componentType={SingleEntities.Contract}
              resourceStatus={status}
            />
          </Tab.Pane>
        ),
      });

      panes.push({
        menuItem: 'Files',
        render: () => (
          <Tab.Pane>
            <FilesList
              files={contract.files}
              entityId={contract.id}
              entity={SingleEntities.Contract}
              fetchEntity={fetchContract}
              generateModal={(
                <GenerateContractModal
                  contractId={contract.id}
                  fetchContract={fetchContract}
                />
                )}
              status={status}
            />
          </Tab.Pane>
        ),
      });
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
        <Grid rows={2}>
          <Grid.Row centered columns={1} style={{ paddingLeft: '1em', paddingRight: '1em' }}>
            <Segment secondary>
              <FinancialDocumentProgress
                documentId={contract.id}
                activities={contract.activities as GeneralActivity[]}
                documentType={SingleEntities.Contract}
                resourceStatus={status}
                roles={[Roles.ADMIN, Roles.GENERAL]}
              />
            </Segment>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column width={10}>
              <Tab panes={panes} menu={{ pointing: true, inverted: true }} />
            </Grid.Column>
            <Grid.Column width={6}>
              <Segment secondary>
                <ContractProps contract={contract} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    contract: getSingle<Contract>(state, SingleEntities.Contract).data,
    status: getSingle<Contract>(state, SingleEntities.Contract).status,
    hasRole: (role: Roles): boolean => authedUserHasRole(state, role),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContract: (id: number) => dispatch(fetchSingle(SingleEntities.Contract, id)),
  clearContract: () => dispatch(clearSingle(SingleEntities.Contract)),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleContractPage));
