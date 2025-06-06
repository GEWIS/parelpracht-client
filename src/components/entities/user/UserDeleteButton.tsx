
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button, ButtonProps } from 'semantic-ui-react';
import ResourceStatus from '../../../stores/resourceStatus';
import { deleteSingle } from '../../../stores/single/actionCreators';
import { getSingle } from '../../../stores/single/selectors';
import { SingleEntities } from '../../../stores/single/single';
import { RootState } from '../../../stores/store';

interface Props extends ButtonProps {
  userId: number;
  status: ResourceStatus;

  deleteUser: (id: number) => void;
}

function UserDeleteButton(props: Props) {
  const {
    userId, deleteUser, status, ...rest
  } = props;

  if (status === ResourceStatus.DELETING) {
    return (
      <Button
        negative
        icon="trash"
        {...rest}
        loading
      />
    );
  }
  return (
    <Button
      negative
      icon="trash"
      {...rest}
      onClick={() => deleteUser(userId)}
    />
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle(state, SingleEntities.User).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  deleteUser: (id: number) => dispatch(
    deleteSingle(SingleEntities.User, id),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDeleteButton);
