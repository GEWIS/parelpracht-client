import React from 'react';
import { connect } from 'react-redux';
import {
  Grid, Header, Icon, Image, Loader, Placeholder, Segment,
} from 'semantic-ui-react';
import { Contract } from '../../clients/server.generated';
import { getCompanyLogo, getCompanyName } from '../../stores/company/selectors';
import { getContactName } from '../../stores/contact/selectors';
import ResourceStatus from '../../stores/resourceStatus';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import { getUserName } from '../../stores/user/selectors';
import CompanyLink from '../company/CompanyLink';
import UserLink from '../user/UserLink';
import { formatPriceFull } from '../../helpers/monetary';

interface Props {
  contract: Contract | undefined;
  status: ResourceStatus;
  contactName: string;
  logoFilename: string;
}

function ContractSummary(props: Props) {
  const {
    contract, status, contactName, logoFilename,
  } = props;

  if (contract === undefined
    || (status !== ResourceStatus.FETCHED
      && status !== ResourceStatus.SAVING
      && status !== ResourceStatus.ERROR)) {
    return (
      <>
        <Header as="h1" attached="top" style={{ backgroundColor: 'rgba(235, 235, 235, 0.8)' }}>
          <Icon name="shopping bag" />
          <Header.Content>
            <Header.Subheader>Contract</Header.Subheader>
            <Loader active inline />
          </Header.Content>
        </Header>
        <Segment attached="bottom" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Placeholder><Placeholder.Line length="long" /></Placeholder>
        </Segment>
      </>
    );
  }

  const totalValue = contract.products
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
      <Header as="h1" attached="top" style={{ backgroundColor: 'rgba(235, 235, 235, 0.8)' }}>
        <Grid>
          <Grid.Row columns="2">
            <Grid.Column>
              <Grid columns="equal">
                <Grid.Column width="1">
                  <Icon name="file alternate" size="large" style={{ padding: '0.5rem' }} />
                </Grid.Column>
                <Grid.Column>
                  <Header.Content style={{ paddingLeft: '1.25rem' }}>
                    <Header.Subheader>Contract</Header.Subheader>
                    C
                    {contract.id}
                    {' '}
                    {contract.title}
                  </Header.Content>
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column>
              {logo}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Header>
      <Segment attached="bottom" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Grid columns={4}>
          <Grid.Column>
            <h5>Company</h5>
            <CompanyLink id={contract.companyId} />
          </Grid.Column>
          <Grid.Column>
            <h5>Contact</h5>
            <p>
              {contactName}
            </p>
          </Grid.Column>
          <Grid.Column>
            <h5>Assigned to</h5>
            <UserLink id={contract.assignedToId} />
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
  const { data, status } = getSingle<Contract>(state, SingleEntities.Contract);
  return {
    contract: data,
    status,
    companyName: data ? getCompanyName(state, data.companyId) : '...',
    logoFilename: data ? getCompanyLogo(state, data.companyId) : '',
    createdByName: data ? getUserName(state, data.createdById) : '...',
    contactName: data ? getContactName(state, data.contactId) : '...',
  };
};

export default connect(mapStateToProps)(ContractSummary);
