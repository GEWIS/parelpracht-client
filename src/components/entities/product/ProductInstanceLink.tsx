import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { RootState } from '../../../stores/store';
import { getProductName } from '../../../stores/product/selectors';
import { SingleEntities } from '../../../stores/single/single';

interface Props {
  entityId: number;
  entity: SingleEntities;
  productInstanceId: number;

  productName: string;
  details?: string;
}

function ProductInstanceLink(props: Props) {
  const { entity, entityId, productInstanceId, productName, details = '' } = props;
  return (
    <NavLink to={`/${entity.toLowerCase()}/${entityId}/product/${productInstanceId}`}>
      <Icon name="shopping bag" />
      {productName}
      {details === '' ? '' : ` (${details})`}
    </NavLink>
  );
}

const mapStateToProps = (state: RootState, props: { productId: number }) => {
  return {
    productName: getProductName(state, props.productId),
  };
};

export default connect(mapStateToProps)(ProductInstanceLink);
