import React from 'react';
import { connect } from 'react-redux';
import {
  Grid, Header, Icon, Loader, Placeholder, Segment,
} from 'semantic-ui-react';
import { User } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import ResourceStatus from '../../stores/resourceStatus';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';

interface Props {
  user: User | undefined;
  status: ResourceStatus;
}

function UserSummary(props: Props) {
  const { user, status } = props;
  if (user === undefined
    || (status !== ResourceStatus.FETCHED
      && status !== ResourceStatus.SAVING
      && status !== ResourceStatus.ERROR)) {
    return (
      <>
        <Header as="h1" attached="top" style={{ backgroundColor: '#eee' }}>
          <Icon name="user" />
          <Header.Content>
            <Header.Subheader>User</Header.Subheader>
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
        <Icon name="user" />
        <Header.Content>
          <Header.Subheader>User</Header.Subheader>
          {formatContactName(user.firstName, user.middleName, user.lastName)}
        </Header.Content>
      </Header>
      <Segment attached="bottom">
        <Grid columns={4}>
          <Grid.Column>
            <h5>Name</h5>
            <p>{formatContactName(user.firstName, user.middleName, user.lastName)}</p>
          </Grid.Column>
          <Grid.Column>
            <h5>Email</h5>
            <p>{user.email}</p>
          </Grid.Column>
          <Grid.Column>
            <h5>Gender</h5>
            <p>{user.gender}</p>
          </Grid.Column>
        </Grid>
      </Segment>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    user: getSingle<User>(state, SingleEntities.User).data,
    status: getSingle<User>(state, SingleEntities.User).status,
  };
};

export default connect(mapStateToProps)(UserSummary);
