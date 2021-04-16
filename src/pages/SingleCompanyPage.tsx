import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb, Container, Grid, Loader, Segment, Tab,
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
import { authedUserHasRole } from '../stores/auth/selectors';
import AuthorizationComponent from '../components/AuthorizationComponent';

interface Props extends RouteComponentProps<{ companyId: string }> {
  company: Company | undefined;
  status: ResourceStatus;

  fetchCompany: (id: number) => void;
  clearCompany: () => void;
  showTransientAlert: (alert: TransientAlert) => void;
  hasRole: (role: Roles) => boolean;
}

interface State {
  paneIndex: number;
}

class SingleCompanyPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const panes = this.getPanes();
    let { hash } = this.props.location;
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
      this.props.history.replace(`#${panes[0].menuItem.toLowerCase()}`);
    }

    this.state = {
      paneIndex: index,
    };
  }

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
        displayTimeInMs: 3000,
      });
    }
    if (this.props.status === ResourceStatus.FETCHED
    && prevProps.status === ResourceStatus.SAVING) {
      this.props.showTransientAlert({
        title: 'Success',
        message: `Properties of ${this.props.company?.name} successfully updated.`,
        type: 'success',
        displayTimeInMs: 3000,
      });
    }
  }

  getPanes = () => {
    const {
      company, fetchCompany, status, hasRole,
    } = this.props;

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
    ];

    if (hasRole(Roles.ADMIN) || hasRole(Roles.GENERAL) || hasRole(Roles.AUDIT)) {
      panes.push({
        menuItem: 'Activities',
        render: company ? () => (
          <Tab.Pane>
            <ActivitiesList
              activities={company.activities as GeneralActivity[]}
              componentId={company.id}
              componentType={SingleEntities.Company}
              resourceStatus={status}
            />
          </Tab.Pane>
        ) : () => <Tab.Pane />,
      });

      panes.push({
        menuItem: 'Files',
        render: company ? () => (
          <Tab.Pane>
            <FilesList
              files={company.files}
              entityId={company.id}
              entity={SingleEntities.Company}
              fetchEntity={fetchCompany}
              status={status}
            />
          </Tab.Pane>
        ) : () => <Tab.Pane />,
      });
    }

    if (hasRole(Roles.ADMIN) || hasRole(Roles.GENERAL)) {
      panes.push({
        menuItem: 'Insights',
        render: company ? () => (
          // <Tab.Pane> is set in this tab, because it needs to fetch data and
          /// therefore needs to show a loading animation
          <CompanyContractedProductsChart company={company} />
        ) : () => <Tab.Pane />,
      });
    }

    return panes;
  };

  public render() {
    const { company } = this.props;
    const { paneIndex } = this.state;

    if (company === undefined) {
      return (
        <AuthorizationComponent
          roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]}
          notFound
        >
          <Container style={{ paddingTop: '1em' }}>
            <Loader content="Loading" active />
          </Container>
        </AuthorizationComponent>
      );
    }

    const panes = this.getPanes();

    return (
      <AuthorizationComponent
        roles={[Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]}
        notFound
      >
        <Segment style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }} vertical basic>
          <Container>
            <Breadcrumb
              icon="right angle"
              sections={[
                { key: 'Companies', content: <NavLink to="/company">Companies</NavLink> },
                { key: 'Company', content: company.name, active: true },
              ]}
            />
          </Container>
        </Segment>
        <Container style={{ marginTop: '1.25em' }}>
          <CompanySummary />
          <Grid columns={2}>
            <Grid.Column width={10}>
              <Tab
                panes={panes}
                menu={{ pointing: true, inverted: true }}
                onTabChange={(e, data) => {
                  this.setState({ paneIndex: data.activeIndex! as number });
                  this.props.history.replace(`#${data.panes![data.activeIndex! as number].menuItem.toLowerCase()}`);
                }}
                activeIndex={paneIndex}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <Segment secondary style={{ backgroundColor: 'rgba(243, 244, 245, 0.98)' }}>
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
    hasRole: (role: Roles): boolean => authedUserHasRole(state, role),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCompany: (id: number) => dispatch(fetchSingle(SingleEntities.Company, id)),
  clearCompany: () => dispatch(clearSingle(SingleEntities.Company)),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleCompanyPage));
