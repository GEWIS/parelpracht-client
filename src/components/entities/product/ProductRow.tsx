import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Product } from '../../../clients/server.generated';
import { formatPriceFull } from '../../../helpers/monetary';
import ProductCategoryLink from '../productcategories/ProductCategoryLink';
import { formatStatus } from '../../../helpers/activity';
import { getLanguage } from '../../../localization';

interface Props {
  product: Product;
}

function ProductRow(props: Props) {
  const currentLanguage = getLanguage();

  const { product } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/product/${product.id}`}>
          {currentLanguage === 'nl-NL' ? product.nameDutch : product.nameEnglish}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        {formatPriceFull(product.targetPrice)}
      </Table.Cell>
      <Table.Cell>
        {formatStatus(product.status)}
      </Table.Cell>
      <Table.Cell>
        <ProductCategoryLink id={product.categoryId} />
      </Table.Cell>
    </Table.Row>
  );
}

export default ProductRow;
