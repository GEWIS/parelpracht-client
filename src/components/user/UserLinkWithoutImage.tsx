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

function UserLinkWithoutImage(props: Props) {
  const { id, userName, ...rest } = props;
  return (
    <NavLink to={`/user/${id}`} {...rest}>
      {userName}
    </NavLink>
  );
}

const mapStateToProps = (state: RootState, props: { id: number }) => {
  return {
    userName: getUserName(state, props.id),
  };
};

export default connect(mapStateToProps)(UserLinkWithoutImage);
