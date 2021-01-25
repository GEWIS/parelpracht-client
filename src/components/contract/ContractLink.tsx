import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { RootState } from '../../stores/store';
import { getContractTitle } from '../../stores/contract/selectors';

interface Props {
  id: number;

  contractTitle: string;
}

function ContractLink(props: Props) {
  const { id, contractTitle } = props;
  return (
    <NavLink to={`/contract/${id}`}>
      <Icon name="file alternate" />
      {contractTitle}
    </NavLink>
  );
}

const mapStateToProps = (state: RootState, props: { id: number }) => {
  return {
    contractTitle: getContractTitle(state, props.id),
  };
};

export default connect(mapStateToProps)(ContractLink);
