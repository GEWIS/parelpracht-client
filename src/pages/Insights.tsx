import * as React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import ContractTableExtensive from '../components/megatable/MegaTable';
import ContractTableExtensiveControls from '../components/megatable/MegaTableControls';

function Insights() {
  return (
    <>
      <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.9)' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
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
      <Container style={{ marginTop: '20px' }}>
        <ContractTableExtensive />
      </Container>
    </>
  );
}

export default withRouter(Insights);
