import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Breadcrumb, Container, Grid, Loader, Segment, Tab, TabPane, TabProps } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Contract, ProductInstanceStatus, Roles } from '../clients/server.generated';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ContractProps from '../components/entities/contract/ContractProps';
import ResourceStatus from '../stores/resourceStatus';
import ContractSummary from '../components/entities/contract/ContractSummary';
import ContractProductList from '../components/entities/contract/ContractProductList';
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
import { TitleContext } from '../components/TitleContext';
import { withRouter, WithRouter } from '../WithRouter';
import NotFound from './NotFound';

interface Props extends WithTranslation, WithRouter {
  contract: Contract | undefined;
  status: ResourceStatus;

  fetchContract: (id: number) => void;
  clearContract: () => void;
  showTransientAlert: (alert: TransientAlert) => void;
  hasRole: (role: Roles) => boolean;
}

interface State {
  paneIndex: number;
}

class SingleContractPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { location, navigate } = this.props.router;

    const panes = this.getPanes();
    let { hash } = location;
    // If there is no hash, do not take the first (#) character
    if (hash.length > 0) {
      hash = hash.substr(1);
    }
    // Find the corresponding tab that has been selected
    let index = panes.findIndex((p) => p.menuItem.toLowerCase() === hash.toLowerCase());
    // If no parameter is given, or a parameter is given that does not exist,
    // select the first one by default
    if (index < 0) {
      index = 0;
      navigate(`#${panes[0].menuItem.toLowerCase()}`, { replace: true });
    }

    this.state = {
      paneIndex: index,
    };
  }

  componentDidMount() {
    const { params } = this.props.router;

    this.props.clearContract();
    if (params.contractId) {
      this.props.fetchContract(Number.parseInt(params.contractId, 10));
    }
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    const { contract, status, t } = this.props;
    const { navigate } = this.props.router;

    if (contract === undefined) {
      document.title = t('entity.contract');
    } else {
      document.title = `C${contract.id} ${contract.title}`;
    }

    if (status === ResourceStatus.EMPTY && prevProps.status === ResourceStatus.DELETING) {
      navigate('/contract');
      this.props.showTransientAlert({
        title: 'Success',
        message: `Contract ${prevProps.contract?.title} successfully deleted`,
        type: 'success',
        displayTimeInMs: 3000,
      });
    }
  }

  getPanes = () => {
    const { contract, fetchContract, status, hasRole, t } = this.props;

    const panes = [
      {
        menuItem: t('entity.productinstances'),
        render: contract
          ? () => (
              <TabPane>
                <ContractProductList contract={contract} />
              </TabPane>
            )
          : () => <TabPane />,
      },
    ];

    if (hasRole(Roles.ADMIN) || hasRole(Roles.GENERAL) || hasRole(Roles.AUDIT)) {
      panes.push({
        menuItem: t('entity.files'),
        render: contract
          ? () => (
              <TabPane>
                <FilesList
                  files={contract.files}
                  entityId={contract.id}
                  entity={SingleEntities.Contract}
                  fetchEntity={fetchContract}
                  generateModal={<GenerateContractModal contract={contract} fetchContract={fetchContract} />}
                  status={status}
                />
              </TabPane>
            )
          : () => <TabPane />,
      });

      panes.push({
        menuItem: t('entity.activities'),
        render: contract
          ? () => (
              <TabPane>
                <ActivitiesList
                  activities={contract.activities as GeneralActivity[]}
                  componentId={contract.id}
                  componentType={SingleEntities.Contract}
                  resourceStatus={status}
                />
              </TabPane>
            )
          : () => <TabPane />,
      });
    }

    return panes;
  };

  public render() {
    const { contract, status, t } = this.props;
    const { paneIndex } = this.state;
    const { navigate } = this.props.router;

    if (status === ResourceStatus.NOTFOUND) {
      return <NotFound />;
    }

    if (contract === undefined) {
      return (
        <Container style={{ paddingTop: '1em' }}>
          <Loader content="Loading" active />
        </Container>
      );
    }

    const panes = this.getPanes();

    return (
      <>
        <Segment style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }} vertical basic>
          <Container>
            <Breadcrumb
              icon="right angle"
              sections={[
                { key: 'Contracts', content: <NavLink to="/contract">{t('entity.contracts')}</NavLink> },
                { key: 'Contract', content: `C${contract.id} ${contract.title}`, active: true },
              ]}
            />
          </Container>
        </Segment>
        <Container style={{ marginTop: '1.25em' }}>
          <ContractSummary />
          <Grid rows={2} stackable>
            <Grid.Row centered columns={1} style={{ paddingLeft: '1em', paddingRight: '1em' }}>
              <Segment secondary style={{ backgroundColor: 'rgba(243, 244, 245, 0.98)' }}>
                <FinancialDocumentProgress
                  documentId={contract.id}
                  activities={contract.activities as GeneralActivity[]}
                  documentType={SingleEntities.Contract}
                  resourceStatus={status}
                  roles={[Roles.ADMIN, Roles.GENERAL]}
                  canCancel={contract.products.every(
                    (p) => p.activities.find((a) => a.subType === ProductInstanceStatus.CANCELLED) !== undefined,
                  )}
                  cancelReason={t('pages.contract.cancelError')}
                />
              </Segment>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column width={10}>
                <Tab
                  panes={panes}
                  menu={{ pointing: true, inverted: true }}
                  onTabChange={(_, data) => {
                    this.setState({ paneIndex: data.activeIndex! as number });
                    navigate(`#${data.panes![data.activeIndex! as number].menuItem.toLowerCase()}`, { replace: true });
                  }}
                  activeIndex={paneIndex}
                />
              </Grid.Column>
              <Grid.Column width={6}>
                <Segment secondary style={{ backgroundColor: 'rgba(243, 244, 245, 0.98)' }}>
                  <ContractProps contract={contract} />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </>
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

SingleContractPage.contextType = TitleContext;

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleContractPage)));
