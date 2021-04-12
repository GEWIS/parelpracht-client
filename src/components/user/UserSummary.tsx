import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Grid, Header, Icon, Loader, Placeholder, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { User } from '../../clients/server.generated';
import { formatContactName, formatGender } from '../../helpers/contact';
import ResourceStatus from '../../stores/resourceStatus';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import LogoAvatarModal from '../files/LogoAvatarModal';
import { fetchSingle } from '../../stores/single/actionCreators';

interface Props extends RouteComponentProps {
  user: User | undefined;
  status: ResourceStatus;
  fetchUser: (id: number) => void;
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

  const { user, status, fetchUser } = props;
  if (user === undefined
    || status === ResourceStatus.EMPTY || status === ResourceStatus.FETCHING) {
    return (
      <>
        <Header as="h1" attached="top" style={{ backgroundColor: 'rgba(238, 238, 238, 0.95)' }}>
          <Icon name="user" />
          <Header.Content>
            <Header.Subheader>User</Header.Subheader>
            <Loader active inline />
          </Header.Content>
        </Header>
        <Segment attached="bottom" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Placeholder><Placeholder.Line length="long" /></Placeholder>
        </Segment>
      </>
    );
  }

  return (
    <>
      <Header as="h1" attached="top" style={{ backgroundColor: 'rgba(238, 238, 238, 0.95)' }}>
        <Grid>
          <Grid.Row columns="2">
            <Grid.Column>
              <Icon name="user" size="large" style={{ padding: '0.5rem' }} />
              <Header.Content style={{ paddingLeft: '0.75rem' }}>
                <Header.Subheader>User</Header.Subheader>
                {formatContactName(user.firstName, user.lastNamePreposition, user.lastName)}
              </Header.Content>
            </Grid.Column>
            <Grid.Column>
              <LogoAvatarModal
                entity={SingleEntities.User}
                entityId={user.id}
                entityName={user.firstName}
                fileName={user.avatarFilename}
                fetchEntity={fetchUser}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Header>
      <Segment attached="bottom" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchUser: (id: number) => dispatch(fetchSingle(SingleEntities.User, id)),
});

const mapStateToProps = (state: RootState) => {
  return {
    user: getSingle<User>(state, SingleEntities.User).data,
    status: getSingle<User>(state, SingleEntities.User).status,
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserSummary));
