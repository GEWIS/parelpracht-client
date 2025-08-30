import { Container, Grid, Segment } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Version from '../Version';
import Credits from '../Credits';

function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { t } = useTranslation();

  useEffect(() => {
    const { date: rawDate } = __LAST_COMMIT_INFO;
    const y = new Date(rawDate).getFullYear();
    setYear(y);
  }, []);

  return (
    <Segment vertical basic inverted className="footer" style={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
      <Container>
        <Grid columns={2}>
          <Grid.Column textAlign="left" style={{ padding: '1rem' }}>
            <Version />
            <span style={{ marginRight: '0.5em', marginLeft: '0.5em' }}>-</span>
            {`© ${t('footer.gewis')} - 2022-${year}`}
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
