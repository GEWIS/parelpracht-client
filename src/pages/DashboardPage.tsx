import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { AuthStatus, User } from '../clients/server.generated';
import { RootState } from '../stores/store';
import DashboardInvoices from '../components/dashboard/DashboardInvoices';
import DashboardContracts from '../components/dashboard/DashboardContracts';

interface Props extends RouteComponentProps {
  // eslint-disable-next-line react/no-unused-prop-types
  user: User | undefined;
}

function DashboardPage(props: Props) {
  const {
    user,
  } = props;
  return (
    <>
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="hand paper" />
                <Header.Content>
                  <Header.Subheader>Dashboard</Header.Subheader>
                  Welcome back,
                  {' '}
                  {user?.firstName}
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid>

        </Container>
      </Segment>
      <Container />

      <Container style={{ marginTop: '2em' }}>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={10} />
            <Grid.Column width={6}>
              <DashboardContracts />
              <DashboardInvoices />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.auth.profile,
  };
};

export default withRouter(connect(mapStateToProps)(DashboardPage));
