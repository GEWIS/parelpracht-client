import React from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { ETCompany, ETContract, ETProductInstance } from '../../helpers/extensiveTableObjects';
import { formatPriceFull } from '../../helpers/monetary';
import { ProductSummary } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { prodInsStatus } from '../../helpers/statusses';

interface Props {
  company: ETCompany;
  products: ProductSummary[];
}

function ContractExtensiveRow(props: Props) {
  const { company, products } = props;

  const productMap: Record<number, string> = {};
  // eslint-disable-next-line array-callback-return
  products.map((p) => { productMap[p.id] = p.nameEnglish; });

  console.log(productMap);

  const getNrOfProducts = () => {
    let count = 0;
    for (let i = 0; i < company.contracts.length; i++) {
      count += company.contracts[0].products.length;
    }
    return count;
  };

  const getProductFromId = (id: number) => {
    return productMap[id];
    // return products.find((p) => p.id === id)!.nameEnglish;
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
          <NavLink to={`/company/${company.id}`}>
            {company.name}
          </NavLink>
        </Table.Cell>
      ));
    }
    if (productInstanceNr === 0) {
      contract = company.contracts[contractNr];
      innerResult.push((
        <Table.Cell rowSpan={contract.products.length}>
          <NavLink to={`/contract/${contract.id}`}>
            {contract.title}
          </NavLink>
        </Table.Cell>
      ));
    }
    product = contract!.products[productInstanceNr];
    innerResult.push((
      <Table.Cell>
        {getProductFromId(product.productId)}
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
    <>
      {result}
    </>
  );
}

const mapStateToProps = (state: RootState) => ({
  products: state.summaries.Products.options,
});

export default connect(mapStateToProps)(ContractExtensiveRow);
