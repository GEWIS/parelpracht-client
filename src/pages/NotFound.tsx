import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment, Image,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { AuthStatus, User } from '../clients/server.generated';
import { RootState } from '../stores/store';

function NotFound() {
  return (
    <>
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '2em' }}>
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
            <Image src="https://gewis.nl/~ceb/public/2021/peach.webp" fluid />
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
