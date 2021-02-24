import React from 'react';
import { connect } from 'react-redux';
import {
  Grid, Header, Icon, Image, Loader, Placeholder, Segment,
} from 'semantic-ui-react';
import { Invoice } from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import CompanyLink from '../company/CompanyLink';
import UserLink from '../user/UserLink';
import { formatPriceFull } from '../../helpers/monetary';
import { getCompanyLogo } from '../../stores/company/selectors';

interface Props {
  invoice: Invoice | undefined;
  status: ResourceStatus;
  logoFilename: string;
}

function InvoiceSummary(props: Props) {
  const { invoice, status, logoFilename } = props;
  if (invoice === undefined
    || (status !== ResourceStatus.FETCHED
      && status !== ResourceStatus.SAVING
      && status !== ResourceStatus.ERROR)) {
    return (
      <>
        <Header as="h1" attached="top" style={{ backgroundColor: '#eee' }}>
          <Icon name="money bill alternate outline" />
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

  const totalValue = invoice.products
    .reduce((a, b) => a + (b.basePrice - b.discount), 0);

  const logo = logoFilename !== '' ? (
    <Image
      floated="right"
      src={`/static/logos/${logoFilename}`}
      style={{ maxHeight: '4rem', width: 'auto' }}
    />
  ) : <div />;

  return (
    <>
      <Header as="h1" attached="top" style={{ backgroundColor: '#eee' }}>
        <Grid>
          <Grid.Row columns="2">
            <Grid.Column>
              <Icon name="money bill alternate outline" size="large" style={{ padding: '0.5rem 4.5rem 0.5rem 0.5rem' }} />
              <Header.Content>
                <Header.Subheader>Invoice</Header.Subheader>
                F
                {invoice.id}
                {' '}
                {invoice.title}
              </Header.Content>
            </Grid.Column>
            <Grid.Column>
              {logo}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Header>
      <Segment attached="bottom">
        <Grid columns={4}>
          <Grid.Column>
            <h5>Company</h5>
            <CompanyLink id={invoice.companyId} />
          </Grid.Column>
          <Grid.Column>
            <h5>Created by</h5>
            <UserLink id={invoice.createdById} />
          </Grid.Column>
          <Grid.Column>
            <h5>Total value</h5>
            <p>{formatPriceFull(totalValue)}</p>
          </Grid.Column>
        </Grid>
      </Segment>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { data, status } = getSingle<Invoice>(state, SingleEntities.Invoice);
  return {
    invoice: data,
    status,
    logoFilename: data ? getCompanyLogo(state, data.companyId) : '',
  };
};

export default connect(mapStateToProps)(InvoiceSummary);
