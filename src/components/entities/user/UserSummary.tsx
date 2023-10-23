import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Navigate as Redirect } from 'react-router-dom';
import { Dispatch } from 'redux';
import { useTranslation } from 'react-i18next';
import { User } from '../../../clients/server.generated';
import { formatContactName, formatGender } from '../../../helpers/contact';
import ResourceStatus from '../../../stores/resourceStatus';
import { getSingle } from '../../../stores/single/selectors';
import { SingleEntities } from '../../../stores/single/single';
import { RootState } from '../../../stores/store';
import LogoAvatarModal from '../../files/LogoAvatarModal';
import { fetchSingle } from '../../../stores/single/actionCreators';
import { EntitySummary } from '../EntitySummary';
import { withRouter } from '../../../WithRouter';

interface Props {
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
  const { t } = useTranslation();
  const prevStatus = usePrevious(props.status);

  // Check if user was deleted
  if (prevStatus === ResourceStatus.DELETING
    && props.status === ResourceStatus.EMPTY) {
    return (<Redirect to="/users" />);
  }

  const { user, status, fetchUser } = props;

  if (user === undefined) {
    return (
      <EntitySummary
        loading
        entity={SingleEntities.User}
        icon="user"
      />
    );
  }

  const loading = (status !== ResourceStatus.FETCHED
    && status !== ResourceStatus.SAVING
    && status !== ResourceStatus.ERROR);

  const avatar = (
    <LogoAvatarModal
      entity={SingleEntities.User}
      entityId={user.id}
      entityName={user.firstName}
      fileName={user.avatarFilename}
      fetchEntity={fetchUser}
    />
  );

  return (
    <EntitySummary
      loading={loading}
      entity={SingleEntities.User}
      icon="user"
      title={formatContactName(user.firstName, user.lastNamePreposition, user.lastName)}
      rightHeader={avatar}
    >
      <div>
        <h5>{t('entities.user.props.name')}</h5>
        <p>{formatContactName(user.firstName, user.lastNamePreposition, user.lastName)}</p>
      </div>
      <div>
        <h5>{t('entities.user.props.personalEmail')}</h5>
        <p>{user.email}</p>
      </div>
      <div>
        <h5>{t('entities.user.props.gender.header')}</h5>
        <p>{formatGender(user.gender)}</p>
      </div>
    </EntitySummary>
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
