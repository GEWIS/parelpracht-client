import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { RootState } from '../../stores/store';
import { getContractTitle } from '../../stores/contract/selectors';

interface Props {
  id: number;
  showId: boolean;
  showName: boolean;

  contractTitle: string;
}

function ContractLink(props: Props) {
  const {
    id, showId, showName, contractTitle,
  } = props;
  return (
    <NavLink to={`/contract/${id}`} style={{ whiteSpace: 'nowrap' }}>
      <Icon name="file alternate" />
      {showId ? `C${id} ` : ''}
      {showName ? contractTitle : ''}
    </NavLink>
  );
}

const mapStateToProps = (state: RootState, props: { id: number }) => {
  return {
    contractTitle: getContractTitle(state, props.id),
  };
};

export default connect(mapStateToProps)(ContractLink);
