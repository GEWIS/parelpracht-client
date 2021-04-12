import React from 'react';
import {
  Container, Grid, Header, Icon, Segment, Image,
} from 'semantic-ui-react';

function NoRights() {
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
                    Stop, hammertime!
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
              Sorry, you don&apos;t have the rights to view this page!
            </h1>
            <h1 style={{ fontSize: '40px', color: '#737373' }}>
              Please contact your administrator.
            </h1>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
}

export default NoRights;
