import { withTranslation, WithTranslation } from 'react-i18next';
import {
  Container, Grid, Header, Icon, Message, Segment,
} from 'semantic-ui-react';
import React from 'react';
import FinancialOverview from '../components/dashboard/FinancialOverview';
import DashboardContractedCategoryGraph from '../components/dashboard/DashboardContractedCategoryGraph';
import DashboardContracts from '../components/dashboard/DashboardContracts';
import DashboardInvoices from '../components/dashboard/DashboardInvoices';
import RoleTable from '../components/settings/RoleTable';

interface Props extends WithTranslation {}

function SettingsPage(props: Props) {
  const { t } = props;

  return (
    <>
      <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
          <Grid columns={1}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="settings" />
                <Header.Content>
                  <Header.Subheader>{t('pages.settings.header.subheader')}</Header.Subheader>
                  {t('pages.settings.header.header')}
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid>

        </Container>
      </Segment>
      <Container style={{ marginTop: '2em' }}>
        <Message error>
          {t('pages.settings.warning')}
        </Message>
        <Segment>
          <RoleTable />
        </Segment>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={8} />
          </Grid.Row>
        </Grid>
      </Container>
    </>
  );
}

export default withTranslation()(SettingsPage);
