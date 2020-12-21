import React from 'react';
import { connect } from 'react-redux';
import {
  Grid, Header, Icon, Loader, Placeholder, Segment,
} from 'semantic-ui-react';
import { Contract } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';

interface Props {
  contract: Contract | undefined;
  status: ResourceStatus;
}

function ContractSummary(props: Props) {
  const { contract, status } = props;
  if (contract === undefined
    || (status !== ResourceStatus.FETCHED
      && status !== ResourceStatus.SAVING
      && status !== ResourceStatus.ERROR)) {
    return (
      <>
        <Header as="h1" attached="top" inverted>
          <Icon name="shopping bag" />
          <Header.Content>
            <Header.Subheader>Contract</Header.Subheader>
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
        <Icon name="shopping bag" />
        <Header.Content>
          <Header.Subheader>Contract</Header.Subheader>
          {contract.title}
        </Header.Content>
      </Header>
      <Segment attached="bottom">
        <Grid columns={4}>
          <Grid.Column>
            <h5>Title</h5>
            <p>{contract.title}</p>
          </Grid.Column>
          <Grid.Column>
            <h5>Company ID</h5>
            <p>{contract.companyId}</p>
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
    contract: state.contract.single,
    status: state.contract.singleStatus,
  };
};

export default connect(mapStateToProps)(ContractSummary);
