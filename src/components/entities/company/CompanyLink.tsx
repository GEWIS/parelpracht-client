/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { getCompanyName } from '../../../stores/company/selectors';
import { RootState } from '../../../stores/store';

interface Props {
  id: number;

  companyName: string;
}

function CompanyLink(props: Props) {
  const { id, companyName } = props;
  return (
    <NavLink to={`/company/${id}`} style={{ whiteSpace: 'nowrap' }}>
      <Icon name="building" />
      {companyName}
    </NavLink>
  );
}

const mapStateToProps = (state: RootState, props: { id: number }) => {
  return {
    companyName: getCompanyName(state, props.id),
  };
};

export default connect(mapStateToProps)(CompanyLink);
