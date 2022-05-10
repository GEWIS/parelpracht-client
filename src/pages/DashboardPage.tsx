import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { User } from '../clients/server.generated';
import { RootState } from '../stores/store';
import DashboardInvoices from '../components/dashboard/DashboardInvoices';
import DashboardContracts from '../components/dashboard/DashboardContracts';
import FinancialOverview from '../components/dashboard/FinancialOverview';
import DashboardContractedCategoryGraph from '../components/dashboard/DashboardContractedCategoryGraph';
import { useTitle } from '../components/TitleContext';

interface Props extends WithTranslation, RouteComponentProps {
  // eslint-disable-next-line react/no-unused-prop-types
  user: User | undefined;
}

function DashboardPage(props: Props) {
  const { user, t } = props;
  const { setTitle } = useTitle();

  React.useEffect(() => {
    setTitle(t('dashboard.title'));
  }, []);

  var current = new Date();
  console.error(current);

  return (
    <>
      <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="hand paper" />
                <Header.Content>
                  <Header.Subheader>Dashboard</Header.Subheader>
                  {t('dashboard.welcome')}
                  {' '}
                  {user?.firstName}
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid>

        </Container>
      </Segment>
      <Container style={{ marginTop: '2em' }}>
        <Grid stackable>
          <Grid.Row columns={2}>
            <Grid.Column width={9}>
              <FinancialOverview />
              <DashboardContractedCategoryGraph />
            </Grid.Column>
            <Grid.Column width={7}>
              <DashboardContracts />
              <DashboardInvoices />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </ >
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.auth.profile,
  };
};

export default withTranslation()(withRouter(connect(mapStateToProps)(DashboardPage)));
