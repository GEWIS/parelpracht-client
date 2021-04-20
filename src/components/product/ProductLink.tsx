/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { RootState } from '../../stores/store';
import { getProductName } from '../../stores/product/selectors';

interface Props {
  id: number;

  productName: string;
}

function ProductLink(props: Props) {
  const { id, productName } = props;
  return (
    <NavLink to={`/product/${id}`} style={{ whiteSpace: 'nowrap' }}>
      <Icon name="shopping bag" />
      {productName}
    </NavLink>
  );
}

const mapStateToProps = (state: RootState, props: { id: number }) => {
  return {
    productName: getProductName(state, props.id),
  };
};

export default connect(mapStateToProps)(ProductLink);
