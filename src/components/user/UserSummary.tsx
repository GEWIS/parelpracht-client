import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Grid, Header, Icon, Loader, Placeholder, Segment,
} from 'semantic-ui-react';
import { User } from '../../clients/server.generated';
import { formatContactName, formatGender } from '../../helpers/contact';
import ResourceStatus from '../../stores/resourceStatus';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import UserDeleteButton from './UserDeleteButton';
import UserMoveAssignmentsButton from './UserMoveAssignmentsButton';

interface Props extends RouteComponentProps {
  user: User | undefined;
  status: ResourceStatus;
}

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function UserSummary(props: Props) {
  const prevStatus = usePrevious(props.status);

  // Check if user was deleted
  if (prevStatus === ResourceStatus.DELETING
    && props.status === ResourceStatus.EMPTY) {
    return (<Redirect to="/user" />);
  }

  const { user, status } = props;
  if (user === undefined
    || status === ResourceStatus.EMPTY || status === ResourceStatus.FETCHING) {
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
        <Header.Content style={{ width: '100%' }}>
          <Header.Subheader>User</Header.Subheader>
          {formatContactName(user.firstName, user.lastNamePreposition, user.lastName)}
          <UserDeleteButton floated="right" />
          <UserMoveAssignmentsButton userId={user.id} />
        </Header.Content>
      </Header>
      <Segment attached="bottom">
        <Grid columns={4}>
          <Grid.Column>
            <h5>Name</h5>
            <p>{formatContactName(user.firstName, user.lastNamePreposition, user.lastName)}</p>
          </Grid.Column>
          <Grid.Column>
            <h5>Email</h5>
            <p>{user.email}</p>
          </Grid.Column>
          <Grid.Column>
            <h5>Gender</h5>
            <p>{formatGender(user.gender)}</p>
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

export default withRouter(connect(mapStateToProps)(UserSummary));
