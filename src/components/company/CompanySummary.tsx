import React from 'react';
import { connect } from 'react-redux';
import {
  Grid, Header, Icon, Loader, Placeholder, Segment,
} from 'semantic-ui-react';
import { Company } from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';

interface Props {
  company: Company | undefined;
  status: ResourceStatus;
}

function CompanySummary(props: Props) {
  const { company, status } = props;
  if (company === undefined
    || (status !== ResourceStatus.FETCHED
      && status !== ResourceStatus.SAVING
      && status !== ResourceStatus.ERROR)) {
    return (
      <>
        <Header as="h1" attached="top" inverted>
          <Icon name="building" />
          <Header.Content>
            <Header.Subheader>Company</Header.Subheader>
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
        <Icon name="building" />
        <Header.Content>
          <Header.Subheader>Company</Header.Subheader>
          {company.name}
        </Header.Content>
      </Header>
      <Segment attached="bottom">
        <Grid columns={4}>
          <Grid.Column>
            <h5>Description</h5>
            <p>{company.description}</p>
          </Grid.Column>
          <Grid.Column>
            <h5>Status</h5>
            <p>{company.status}</p>
          </Grid.Column>
          <Grid.Column>
            <h5>Created by</h5>
          </Grid.Column>
        </Grid>
      </Segment>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    company: getSingle<Company>(state, SingleEntities.Company).data,
    status: getSingle<Company>(state, SingleEntities.Company).status,
  };
};

export default connect(mapStateToProps)(CompanySummary);
