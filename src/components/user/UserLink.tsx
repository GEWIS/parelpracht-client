/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { getUserAvatar, getUserName } from '../../stores/user/selectors';
import { RootState } from '../../stores/store';
import UserAvatar from './UserAvatar';

interface Props {
  id: number;

  userName: string;
  avatarUrl: string;
}

function UserLink(props: Props) {
  const { id, userName, avatarUrl } = props;
  // the avatarUrl is an empty string if the user does not have an avatar
  return (
    <NavLink to={`/user/${id}`} style={{ whiteSpace: 'nowrap' }}>
      {((avatarUrl === '') ? <Icon name="user" /> : (
        <UserAvatar
          size="1.5em"
          fileName={avatarUrl}
          clickable={false}
          imageCss={{ float: 'left', marginRight: '0.3em' }}
        />
      ))}
      {userName}
    </NavLink>
  );
}
const mapStateToProps = (state: RootState, props: { id: number }) => {
  return {
    userName: getUserName(state, props.id),
    avatarUrl: getUserAvatar(state, props.id),
  };
};

export default connect(mapStateToProps)(UserLink);
