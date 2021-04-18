import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button,
  Container, Grid, Header, Icon, Popup, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import InvoicesTable from '../components/invoice/InvoiceTable';
import InvoiceTableControls from '../components/invoice/InvoiceTableControls';
import { Client, Roles } from '../clients/server.generated';
import { fetchTable } from '../stores/tables/actionCreators';
import { Tables } from '../stores/tables/tables';
import AuthorizationComponent from '../components/AuthorizationComponent';

interface Props extends RouteComponentProps {
  refresh: () => void;
}

class InvoicesPage extends React.Component<Props> {
  updateTreasurerLastSeen = async () => {
    const { refresh } = this.props;
    const client = new Client();
    await client.updateLastSeenByTreasurer();
    await refresh();
  };

  render() {
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
                    <Header.Subheader>Invoices</Header.Subheader>
                    All Invoices
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <AuthorizationComponent roles={[Roles.FINANCIAL]} notFound={false}>
                  <Popup
                    trigger={(
                      <Button icon labelPosition="left" primary floated="right" onClick={() => this.updateTreasurerLastSeen()}>
                        <Icon name="eye" />
                        Update Last Seen
                      </Button>
                    )}
                    mouseEnterDelay={500}
                    header="Update Last Seen"
                    content="By updating the last seen, you indicate that all invoice statuses have been updated."
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

export default withRouter(connect(null, mapDispatchToProps)(InvoicesPage));
