import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import ContractsTable from '../components/contract/ContractTable';
import ContractTableControls from '../components/contract/ContractTableControls';

function ContractsPage(props: RouteComponentProps) {
  return (
    <>
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '2em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="shopping bag" />
                <Header.Content>
                  <Header.Subheader>Contracts</Header.Subheader>
                  All Contracts
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Button icon labelPosition="left" primary floated="right" onClick={() => props.history.push('/contract/new')}>
                <Icon name="plus" />
                Add Contract
              </Button>
            </Grid.Column>
          </Grid>

          <ContractTableControls />

        </Container>
      </Segment>
      <Container>
        <ContractsTable />
      </Container>
    </>
  );
}

export default withRouter(ContractsPage);
