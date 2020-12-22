import * as React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Breadcrumb,
  Container, Grid, Loader, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Company } from '../clients/server.generated';
import { fetchSingleCompany, clearSingleCompany } from '../stores/company/actionCreators';
import { RootState } from '../stores/store';
import CompanyProps from '../components/company/CompanyProps';
import ResourceStatus from '../stores/resourceStatus';
import CompanySummary from '../components/company/CompanySummary';
import CompanyContactList from '../components/company/CompanyContactList';

interface Props extends RouteComponentProps<{ companyId: string }> {
  company: Company | undefined;
  status: ResourceStatus;

  fetchCompany: (id: number) => void;
  clearCompany: () => void;
}

class SingleCompanyPage extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
    const { companyId } = props.match.params;

    props.clearCompany();
    props.fetchCompany(Number.parseInt(companyId, 10));
  }

  public render() {
    const { company } = this.props;

    if (company === undefined) {
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
            { key: 'Companies', content: <NavLink to="/company">Companies</NavLink> },
            { key: 'Company', content: company.name, active: true },
          ]}
        />
        <CompanySummary />
        <Grid columns={2}>
          <Grid.Column>
            <Segment>
              <CompanyProps company={company} />
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment secondary>
              <CompanyContactList />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    company: state.company.single,
    status: state.company.singleStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCompany: (id: number) => dispatch(fetchSingleCompany(id)),
  clearCompany: () => dispatch(clearSingleCompany()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleCompanyPage));
