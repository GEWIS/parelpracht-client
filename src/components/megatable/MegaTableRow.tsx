import { ReactNode } from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { formatPriceFull } from '../../helpers/monetary';
import { ETCompany, ETContract, ETProductInstance, ProductSummary } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { prodInsStatus } from '../../helpers/statusses';
import CompanyLink from '../entities/company/CompanyLink';
import ContractLink from '../entities/contract/ContractLink';
import ProductLink from '../entities/product/ProductLink';
import { dateToFullFinancialYear } from '../../helpers/timestamp';

interface Props {
  company: ETCompany;
  products: ProductSummary[];
}

function MegaTableRow(props: Props) {
  const { t } = useTranslation();
  const { company, products } = props;

  const productMap: Record<number, string> = {};

  products.map((p) => {
    productMap[p.id] = p.nameEnglish;
  });

  const getNrOfProducts = () => {
    let count = 0;
    for (let i = 0; i < company.contracts.length; i++) {
      count += company.contracts[i].products.length;
    }
    return count;
  };

  let [contractNr, productInstanceNr] = [0, 0];
  const result: ReactNode[] = [];
  let innerResult: ReactNode[] = [];
  let contract: ETContract;
  let product: ETProductInstance;

  while (contractNr < company.contracts.length) {
    if (contractNr === 0 && productInstanceNr === 0) {
      innerResult.push(
        <Table.Cell rowSpan={getNrOfProducts()} key={company.id}>
          <CompanyLink id={company.id} />
        </Table.Cell>,
      );
    }
    if (productInstanceNr === 0) {
      contract = company.contracts[contractNr];
      innerResult.push(
        <Table.Cell rowSpan={contract.products.length} key={contract.id}>
          <ContractLink id={contract.id} showId={false} showName status={contract.subType} />
        </Table.Cell>,
      );
    }
    product = contract!.products[productInstanceNr];
    innerResult.push(
      <Table.Cell key={`${product.id}-1`}>
        <ProductLink id={product.productId} />
      </Table.Cell>,
    );
    innerResult.push(<Table.Cell key={`${product.id}-2`}>{prodInsStatus(product.subType)}</Table.Cell>);
    innerResult.push(
      <Table.Cell key={`${product.id}-3`}>
        {product.invoiceDate == null ? t('pages.insights.notInvoiced') : dateToFullFinancialYear(product.invoiceDate)}
      </Table.Cell>,
    );
    innerResult.push(
      <Table.Cell key={`${product.id}-4`}>{formatPriceFull(product.basePrice - product.discount)}</Table.Cell>,
    );
    innerResult.push(<Table.Cell key={`${product.id}-5`}>{product.details}</Table.Cell>);

    result.push(<Table.Row key={product.id}>{innerResult}</Table.Row>);
    innerResult = [];
    productInstanceNr++;
    if (productInstanceNr === company.contracts[contractNr].products.length) {
      contractNr++;
      productInstanceNr = 0;
    }
  }

  return <>{result}</>;
}

const mapStateToProps = (state: RootState) => ({
  products: state.summaries.Products.options,
});

export default connect(mapStateToProps)(MegaTableRow);
