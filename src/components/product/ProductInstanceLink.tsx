/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { RootState } from '../../stores/store';
import { getProductName } from '../../stores/product/selectors';
import { SingleEntities } from '../../stores/single/single';

interface Props {
  entityId: number;
  entity: SingleEntities;
  productInstanceId: number;
  productId: number;

  productName: string;
  details?: string;
}

function ProductInstanceLink(props: Props) {
  const {
    entity, entityId, productInstanceId, productName, details, ...rest
  } = props;
  return (
    <NavLink to={`/${entity.toLowerCase()}/${entityId}/product/${productInstanceId}`} {...rest}>
      <Icon name="shopping bag" />
      {productName}
      {' ('}
      {details}
      )
    </NavLink>
  );
}

ProductInstanceLink.defaultProps = {
  details: '',
};

const mapStateToProps = (state: RootState, props: { productId: number }) => {
  return {
    productName: getProductName(state, props.productId),
  };
};

export default connect(mapStateToProps)(ProductInstanceLink);
