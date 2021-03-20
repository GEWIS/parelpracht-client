import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb,
  Container, Grid, Loader, Segment, Tab,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Company, Roles } from '../clients/server.generated';
import { fetchSingle, clearSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import CompanyProps from '../components/company/CompanyProps';
import ResourceStatus from '../stores/resourceStatus';
import CompanySummary from '../components/company/CompanySummary';
import CompanyContactList from '../components/company/CompanyContactList';
import ContractList from '../components/contract/ContractList';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import ActivitiesList from '../components/activities/ActivitiesList';
import { GeneralActivity } from '../components/activities/GeneralActivity';
import { TransientAlert } from '../stores/alerts/actions';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import InvoiceList from '../components/invoice/InvoiceList';
import CompanyContractedProductsChart from '../components/company/CompanyContractedProductsChart';
import FilesList from '../components/files/FilesList';
import AuthorizationComponent from '../components/AuthorizationComponent';

interface Props extends RouteComponentProps<{ companyId: string }> {
  company: Company | undefined;
  status: ResourceStatus;

  fetchCompany: (id: number) => void;
  clearCompany: () => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

class SingleCompanyPage extends React.Component<Props> {
  componentDidMount() {
    const { companyId } = this.props.match.params;

    this.props.clearCompany();
    this.props.fetchCompany(Number.parseInt(companyId, 10));
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.status === ResourceStatus.EMPTY
      && prevProps.status === ResourceStatus.DELETING
    ) {
      this.props.history.push('/company');
      this.props.showTransientAlert({
        title: 'Success',
        message: `Company ${prevProps.company?.name} successfully deleted`,
        type: 'success',
      });
    }
  }

  public render() {
    const { company, fetchCompany, status } = this.props;

    if (company === undefined) {
      return (
        <AuthorizationComponent
          roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]}
          notFound
        >
          <Container style={{ paddingTop: '2em' }}>
            <Loader content="Loading" active />
          </Container>
        </AuthorizationComponent>
      );
    }

    const panes = [
      {
        menuItem: 'Contacts',
        render: () => (
          <Tab.Pane>
            <CompanyContactList />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Contracts',
        render: () => (
          <Tab.Pane>
            <ContractList />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Invoices',
        render: () => (
          <Tab.Pane>
            <InvoiceList />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Activities',
        render: () => (
          <Tab.Pane>
            <ActivitiesList
              activities={company.activities as GeneralActivity[]}
              componentId={company.id}
              componentType={SingleEntities.Company}
              resourceStatus={status}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Files',
        render: () => (
          <Tab.Pane>
            <FilesList
              files={company.files}
              entityId={company.id}
              entity={SingleEntities.Company}
              fetchEntity={fetchCompany}
              status={status}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Insights',
        render: () => (
          // <Tab.Pane> is set in this tab, because it needs to fetch data and
          /// therefore needs to show a loading animation
          <CompanyContractedProductsChart company={company} />
        ),
      },
    ];

    return (
      <AuthorizationComponent
        roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]}
        notFound
      >
        <Container style={{ paddingTop: '2em' }}>
          <Breadcrumb
            icon="right angle"
            sections={[
              { key: 'Companies', content: <NavLink to="/company">Companies</NavLink> },
              { key: 'Company', content: company.name, active: true },
            ]}
          />
          <CompanySummary />
          <Grid columns={2}>
            <Grid.Column width={10}>
              <Tab panes={panes} menu={{ pointing: true, inverted: true }} />
            </Grid.Column>
            <Grid.Column width={6}>
              <Segment secondary>
                <CompanyProps company={company} />
              </Segment>
            </Grid.Column>
          </Grid>
        </Container>
      </AuthorizationComponent>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    company: getSingle<Company>(state, SingleEntities.Company).data,
    status: getSingle<Company>(state, SingleEntities.Company).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCompany: (id: number) => dispatch(fetchSingle(SingleEntities.Company, id)),
  clearCompany: () => dispatch(clearSingle(SingleEntities.Company)),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleCompanyPage));
