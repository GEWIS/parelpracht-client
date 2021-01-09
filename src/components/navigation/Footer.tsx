import React from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';

function Footer() {
  return (
    <div className="footer">
      <Segment style={{ backgroundColor: '#eee', padding: '0' }} vertical basic>
        <Container style={{ padding: '0' }}>
          <Grid columns={2}>
            <Grid.Column textAlign="left">
              © Study Association GEWIS - 2020
            </Grid.Column>
            <Grid.Column textAlign="right">
              Designed and built with
              {' '}
              <span role="img" aria-label="love">🍑</span>
              {' '}
              by the 39th board
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>
    </div>
  );
}

export default Footer;
