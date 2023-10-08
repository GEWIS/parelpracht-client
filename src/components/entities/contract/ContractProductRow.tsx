import React from 'react';
import { Checkbox, Table } from 'semantic-ui-react';
import { ActivityType, ProductInstance, ProductInstanceStatus } from '../../../clients/server.generated';
import './ContractComponent.scss';
import { formatPriceDiscount, formatPriceFull } from '../../../helpers/monetary';
import ProductInstanceLink from '../product/ProductInstanceLink';
import { SingleEntities } from '../../../stores/single/single';
import { formatStatus, getLastStatus } from '../../../helpers/activity';
import InvoiceLink from '../invoice/InvoiceLink';
import { withRouter } from '../../../WithRouter';

interface Props {
  productInstance: ProductInstance;

  selectFunction: (id: number) => void;
  selected: boolean;
}

function showRecentStatus(productInstance: ProductInstance): string {
  const statusArray = productInstance.activities.filter((a) => {
    if (a.type === ActivityType.STATUS) return a;
    return null;
  });

  const sortedArray = statusArray.sort((a, b) => (b.createdAt.getTime() - a.createdAt.getTime()));
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
            disabled={productInstance.invoiceId !== null
              || getLastStatus(productInstance.activities)?.subType
                   === ProductInstanceStatus.CANCELLED}
            checked={selected}
          />
        </Table.Cell>
        <Table.Cell>
          <ProductInstanceLink
            entityId={productInstance.contractId}
            productId={productInstance.productId}
            productInstanceId={productInstance.id}
            entity={SingleEntities.Contract}
            details={productInstance.details}
          />
        </Table.Cell>
        <Table.Cell collapsing>
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
