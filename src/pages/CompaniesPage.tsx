import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Container, Grid, Header, Icon, Segment,
} from 'semantic-ui-react';
import ProductsTable from '../product/ProductTable';
import ProductTableControls from '../product/ProductTableControls';

function CompaniesPage(props: RouteComponentProps) {
  return (
    <>
      <Segment style={{ backgroundColor: '#eee' }} vertical basic>
        <Container style={{ paddingTop: '2em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="building" />
                <Header.Content>
                  <Header.Subheader>Companies</Header.Subheader>
                  All Companies
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Button icon labelPosition="left" primary floated="right" onClick={() => props.history.push('/product/new')}>
                <Icon name="plus" />
                Add Product
              </Button>
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>
    </>
  );
}

export default withRouter(CompaniesPage);