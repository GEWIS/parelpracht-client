import React from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { ETCompany, ETContract, ETProductInstance } from '../../helpers/extensiveTableObjects';
import { formatPriceFull } from '../../helpers/monetary';
import { ProductSummary } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { prodInsStatus } from '../../helpers/statusses';
import CompanyLink from '../company/CompanyLink';
import ContractLink from '../contract/ContractLink';
import ProductLink from '../product/ProductLink';

interface Props {
  company: ETCompany;
  products: ProductSummary[];
}

function MegaTableRow(props: Props) {
  const { company, products } = props;

  const productMap: Record<number, string> = {};
  // eslint-disable-next-line array-callback-return
  products.map((p) => { productMap[p.id] = p.nameEnglish; });

  const getNrOfProducts = () => {
    let count = 0;
    for (let i = 0; i < company.contracts.length; i++) {
      count += company.contracts[i].products.length;
    }
    return count;
  };

  let [contractNr, productInstanceNr] = [0, 0];
  const result: JSX.Element[] = [];
  let innerResult: JSX.Element[] = [];
  let contract: ETContract;
  let product: ETProductInstance;
  while (contractNr < company.contracts.length) {
    if (contractNr === 0 && productInstanceNr === 0) {
      innerResult.push((
        <Table.Cell rowSpan={getNrOfProducts()}>
          <CompanyLink id={company.id} />
        </Table.Cell>
      ));
    }
    if (productInstanceNr === 0) {
      contract = company.contracts[contractNr];
      innerResult.push((
        <Table.Cell rowSpan={contract.products.length}>
          <ContractLink id={contract.id} showId={false} showName />
        </Table.Cell>
      ));
    }
    product = contract!.products[productInstanceNr];
    innerResult.push((
      <Table.Cell>
        <ProductLink id={product.productId} />
      </Table.Cell>));
    innerResult.push(<Table.Cell>{prodInsStatus(product.subType)}</Table.Cell>);
    innerResult.push(<Table.Cell>{product.invoiceId === null ? 'Not invoiced' : 'Invoiced'}</Table.Cell>);
    innerResult.push((
      <Table.Cell>
        {formatPriceFull(product.basePrice - product.discount)}
      </Table.Cell>));
    innerResult.push(<Table.Cell>{product.comments}</Table.Cell>);

    result.push(<Table.Row>{innerResult}</Table.Row>);
    innerResult = [];
    productInstanceNr++;
    if (productInstanceNr === company.contracts[contractNr].products.length) {
      contractNr++;
      productInstanceNr = 0;
    }
  }

  return (
    <Table.Body>
      {result}
    </Table.Body>
  );
}

const mapStateToProps = (state: RootState) => ({
  products: state.summaries.Products.options,
});

export default connect(mapStateToProps)(MegaTableRow);
