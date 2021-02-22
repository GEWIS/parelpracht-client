import * as React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Container, Segment, Grid, Header, Icon,
} from 'semantic-ui-react';
import DirectMailTable from '../components/productdirectmail/DirectMailTable';
import DirectMailTableControls from '../components/productdirectmail/DirectMailTableControls';

function DirectMailPage() {
  return (
    <>
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '2em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="mail" />
                <Header.Content>
                  <Header.Subheader>Activities</Header.Subheader>
                  Direct Mail
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid>
          <DirectMailTableControls />
        </Container>
      </Segment>
      <Container>
        <DirectMailTable price={1.5} />
      </Container>
    </>
  );
}

export default withRouter(DirectMailPage);
