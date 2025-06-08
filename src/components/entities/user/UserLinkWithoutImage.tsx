import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getUserName } from '../../../stores/user/selectors';
import { RootState } from '../../../stores/store';

interface Props {
  id: number;

  userName: string;
}

function UserLinkWithoutImage(props: Props) {
  const { id, userName } = props;
  return <NavLink to={`/user/${id}`}>{userName}</NavLink>;
}

const mapStateToProps = (state: RootState, props: { id: number }) => {
  return {
    userName: getUserName(state, props.id),
  };
};

export default connect(mapStateToProps)(UserLinkWithoutImage);
