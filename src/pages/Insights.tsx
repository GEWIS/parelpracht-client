import * as React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import ContractTableExtensive from '../components/megatable/MegaTable';
import ContractTableExtensiveControls from '../components/megatable/MegaTableControls';
import { useTitle } from '../components/TitleContext';

function Insights() {
  const { t } = useTranslation();
  const { setTitle } = useTitle();

  React.useEffect(() => {
    setTitle(t('entity.insights'));
  }, []);

  return (
    <>
      <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="line graph" />
                <Header.Content>
                  <Header.Subheader>{t('pages.insights.header')}</Header.Subheader>
                  {t('pages.insights.header')}
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
