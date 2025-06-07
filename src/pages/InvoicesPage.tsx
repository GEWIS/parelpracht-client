import { Component } from "react";
import {
  Button,
  Container, Grid, Header, Icon, Popup, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import InvoicesTable from '../components/entities/invoice/InvoiceTable';
import InvoiceTableControls from '../components/entities/invoice/InvoiceTableControls';
import { Client, Roles } from '../clients/server.generated';
import { fetchTable } from '../stores/tables/actionCreators';
import { Tables } from '../stores/tables/tables';
import AuthorizationComponent from '../components/AuthorizationComponent';
import { TitleContext } from '../components/TitleContext';
import {WithRouter, withRouter} from '../WithRouter';

interface Props extends WithTranslation, WithRouter {
  refresh: () => void;
}

class InvoicesPage extends Component<Props> {
  componentDidMount() {
    const { t } = this.props;
    document.title = t('entity.invoices');
  }

  updateTreasurerLastSeen = async () => {
    const { refresh } = this.props;
    const client = new Client();
    await client.updateLastSeenByTreasurer();
    refresh();
  };

  render() {
    const { t } = this.props;

    return (
      <AuthorizationComponent
        roles={[Roles.FINANCIAL, Roles.GENERAL, Roles.ADMIN, Roles.AUDIT]}
        notFound
      >
        <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
          <Container style={{ paddingTop: '1em' }}>
            <Grid columns={2}>
              <Grid.Column>
                <Header as="h1">
                  <Icon name="file alternate" />
                  <Header.Content>
                    <Header.Subheader>{t('mainMenu.invoices')}</Header.Subheader>
                    {t('pages.tables.invoices.header')}
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <AuthorizationComponent roles={[Roles.FINANCIAL]} notFound={false}>
                  <Popup
                    trigger={(
                      <Button icon labelPosition="left" primary floated="right" onClick={(): void => {
                          this.updateTreasurerLastSeen().catch(console.error);
                        }}>
                        <Icon name="eye" />
                        {t('pages.tables.invoices.updateLastSeen')}
                      </Button>
                    )}
                    mouseEnterDelay={500}
                    header={t('pages.tables.invoices.updateLastSeen')}
                    content={t('pages.tables.invoices.updateLastSeenDescription')}
                  />
                </AuthorizationComponent>
              </Grid.Column>
            </Grid>

            <InvoiceTableControls />

          </Container>
        </Segment>
        <Container style={{ marginTop: '20px' }}>
          <InvoicesTable />
        </Container>
      </AuthorizationComponent>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refresh: () => dispatch(fetchTable(Tables.Invoices)),
});

InvoicesPage.contextType = TitleContext;

export default withTranslation()(withRouter(connect(null, mapDispatchToProps)(InvoicesPage)));
