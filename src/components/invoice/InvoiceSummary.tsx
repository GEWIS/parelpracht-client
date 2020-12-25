import React from 'react';
import { connect } from 'react-redux';
import {
  Grid, Header, Icon, Loader, Placeholder, Segment,
} from 'semantic-ui-react';
import { Invoice } from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';

interface Props {
  invoice: Invoice | undefined;
  status: ResourceStatus;
}

function InvoiceSummary(props: Props) {
  const { invoice, status } = props;
  if (invoice === undefined
    || (status !== ResourceStatus.FETCHED
      && status !== ResourceStatus.SAVING
      && status !== ResourceStatus.ERROR)) {
    return (
      <>
        <Header as="h1" attached="top" style={{ backgroundColor: '#eee' }}>
          <Icon name="file alternate" />
          <Header.Content>
            <Header.Subheader>Invoice</Header.Subheader>
            <Loader active inline />
          </Header.Content>
        </Header>
        <Segment attached="bottom">
          <Placeholder><Placeholder.Line length="long" /></Placeholder>
        </Segment>
      </>
    );
  }

  return (
    <>
      <Header as="h1" attached="top" style={{ backgroundColor: '#eee' }}>
        <Icon name="file alternate" />
        <Header.Content>
          <Header.Subheader>Invoice</Header.Subheader>
          {invoice.companyId}
        </Header.Content>
      </Header>
      <Segment attached="bottom">
        <Grid columns={4}>
          <Grid.Column>
            <h5>Company Name</h5>
            <p>{invoice.company}</p>
          </Grid.Column>
        </Grid>
      </Segment>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    invoice: getSingle<Invoice>(state, SingleEntities.Invoice).data,
    status: getSingle<Invoice>(state, SingleEntities.Invoice).status,
  };
};

export default connect(mapStateToProps)(InvoiceSummary);
