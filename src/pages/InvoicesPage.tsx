import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import InvoicesTable from '../components/invoice/InvoiceTable';
import InvoiceTableControls from '../components/invoice/InvoiceTableControls';

function InvoicesPage(props: RouteComponentProps) {
  return (
    <>
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '2em' }}>
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
          </Grid>

          <InvoiceTableControls />

        </Container>
      </Segment>
      <Container>
        <InvoicesTable />
      </Container>
    </>
  );
}

export default withRouter(InvoicesPage);
