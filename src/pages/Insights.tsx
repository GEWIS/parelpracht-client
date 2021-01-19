import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import ContractTableExtensive from '../components/contract/ContractTableExtensive';
import ContractTableExtensiveControls from '../components/contract/ContractTableExtensiveControls';

function Insights(props: RouteComponentProps) {
  return (
    <>
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '2em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="line graph" />
                <Header.Content>
                  <Header.Subheader>Insights</Header.Subheader>
                  Insights
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column />
          </Grid>

          <ContractTableExtensiveControls />

        </Container>
      </Segment>
      <Container>
        <ContractTableExtensive />
      </Container>
    </>
  );
}

export default withRouter(Insights);
