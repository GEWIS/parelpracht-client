import React from 'react';
import {
  Container, Grid, Header, Icon, Segment, Image,
} from 'semantic-ui-react';

function NotFound() {
  return (
    <>
      <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.9)' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="hand paper" />
                <Header.Content>
                  <h1>
                    404: Could not find this page
                  </h1>
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>
      <Container style={{ paddingTop: '4em' }}>
        <Grid columns={2}>
          <Grid.Column textAlign="left" width="4">
            <Image src="/peach.png" fluid />
          </Grid.Column>
          <Grid.Column textAlign="left" verticalAlign="middle" width="12">
            <h1 style={{ fontSize: '70px' }}>
              There is no money here,
              <br />
              keep looking!
            </h1>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
}

export default NotFound;
