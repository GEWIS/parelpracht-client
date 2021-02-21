/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { getUserName } from '../../stores/user/selectors';
import { RootState } from '../../stores/store';

interface Props {
  id: number;

  userName: string;
}

function UserLink(props: Props) {
  const { id, userName } = props;
  return (
    <NavLink to={`/user/${id}`}>
      <Icon name="user" />
      {userName}
    </NavLink>
  );
}

const mapStateToProps = (state: RootState, props: { id: number }) => {
  return {
    userName: getUserName(state, props.id),
  };
};

export default connect(mapStateToProps)(UserLink);
