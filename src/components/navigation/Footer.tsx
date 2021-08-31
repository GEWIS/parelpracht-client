import React from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import Version from '../Version';
import Credits from '../Credits';

function Footer() {
  const { t } = useTranslation();

  return (
    <Segment vertical basic inverted className="footer" style={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
      <Container>
        <Grid columns={2}>
          <Grid.Column textAlign="left" style={{ padding: '1rem' }}>
            <Version />
            <span style={{ marginRight: '0.5em', marginLeft: '0.5em' }}>-</span>
            {`© ${t('footer.gewis')} - 2021`}
          </Grid.Column>
          <Grid.Column textAlign="right" style={{ padding: '1rem' }}>
            <Credits />
          </Grid.Column>
        </Grid>
      </Container>
    </Segment>
  );
}

export default Footer;
