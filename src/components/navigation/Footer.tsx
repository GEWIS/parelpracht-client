import React from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import Version from '../Version';
import Credits from '../Credits';

function Footer() {
  return (
    <div className="footer">
      <Segment style={{ padding: '0' }} vertical basic inverted>
        <Container style={{ padding: '0' }}>
          <Grid columns={2}>
            <Grid.Column textAlign="left">
              <Version />
              <span style={{ marginRight: '0.5em', marginLeft: '0.5em' }}>-</span>
              © Study Association GEWIS - 2020
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Credits />
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>
    </div>
  );
}

export default Footer;
