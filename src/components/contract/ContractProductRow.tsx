import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Checkbox, Table } from 'semantic-ui-react';
import { ActivityType, ProductInstance } from '../../clients/server.generated';
import './ContractComponent.scss';
import { formatPriceDiscount, formatPriceFull } from '../../helpers/monetary';
import ProductInstanceLink from '../product/ProductInstanceLink';
import { SingleEntities } from '../../stores/single/single';
import { formatStatus } from '../../helpers/activity';
import InvoiceLink from '../invoice/InvoiceLink';

interface Props extends RouteComponentProps {
  productInstance: ProductInstance;

  selectFunction: (id: number) => void;
  selected: boolean;
}

function showRecentStatus(productInstance: ProductInstance): string {
  const statusArray = productInstance.activities.filter((a) => {
    if (a.type === ActivityType.STATUS) return a;
    return null;
  });

  // eslint-disable-next-line no-nested-ternary
  // eslint-disable-next-line
  const sortedArray = statusArray.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0))
  if (sortedArray.length === 0) return '';
  return sortedArray[0].subType!;
}

class ContractProductRow extends React.Component<Props> {
  public render() {
    const {
      productInstance, selectFunction, selected,
    } = this.props;

    let invoice;
    if (productInstance.invoiceId) {
      invoice = <InvoiceLink id={productInstance.invoiceId} short />;
    }

    return (
      <Table.Row>
        <Table.Cell collapsing>
          <Checkbox
            onChange={() => {
              selectFunction(productInstance.id);
            }}
            disabled={productInstance.invoiceId !== null}
            checked={selected}
          />
        </Table.Cell>
        <Table.Cell>
          <ProductInstanceLink
            entityId={productInstance.contractId}
            productId={productInstance.productId}
            productInstanceId={productInstance.id}
            entity={SingleEntities.Contract}
            details={productInstance.comments}
          />
        </Table.Cell>
        <Table.Cell collapsing textAlign="right">
          {formatPriceDiscount(productInstance.discount)}
        </Table.Cell>
        <Table.Cell collapsing>
          {formatPriceFull(productInstance.basePrice - productInstance.discount)}
        </Table.Cell>
        <Table.Cell collapsing>
          {formatStatus(showRecentStatus(productInstance))}
        </Table.Cell>
        <Table.Cell collapsing>
          {invoice}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default withRouter(ContractProductRow);
