import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import InvoiceProductRow from './InvoiceProductRow';
import { ActivityType, Client, Invoice } from '../../../clients/server.generated';
import { formatPriceFull } from '../../../helpers/monetary';

interface Props extends RouteComponentProps, WithTranslation {
  invoice: Invoice;

  fetchInvoice: (id: number) => void;
}

interface State {}

class InvoiceProductList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  removeProduct = async (instanceId: number) => {
    const { invoice, fetchInvoice } = this.props;
    const client = new Client();
    await client.deleteProduct2(invoice?.id, instanceId);
    fetchInvoice(invoice.id);
  };

  deleteButtonActive() {
    return !(this.props.invoice.activities
      .filter((a) => a.type === ActivityType.STATUS).length > 1);
  }

  public render() {
    const { invoice, t } = this.props;

    const { products } = invoice;
    let priceSum = 0;
    let discountAmount = 0;
    let discountSum = 0;

    products.forEach((p) => {
      priceSum += p.basePrice;
      discountSum += p.discount;
      if (p.discount !== 0) {
        discountAmount++;
      }
    });

    const discountedPriceSum = priceSum - discountSum;

    return (
      <>
        <h3>
          {t('entity.productinstances')}
        </h3>
        <Table compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{t('entity.productinstance')}</Table.HeaderCell>
              <Table.HeaderCell collapsing>{t('entities.productInstance.props.discount')}</Table.HeaderCell>
              <Table.HeaderCell collapsing>{t('entities.productInstance.props.realPrice')}</Table.HeaderCell>
              <Table.HeaderCell collapsing>{t('entity.contract')}</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>

          </Table.Header>
          <Table.Body>
            {products.map((product) => (
              <InvoiceProductRow
                key={product.id}
                productInstance={product}
                removeProduct={this.removeProduct}
                canDelete={this.deleteButtonActive()}
              />
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>
                {t('pages.tables.generalColumns.total')}
                :
              </Table.HeaderCell>
              <Table.HeaderCell collapsing>
                {formatPriceFull(discountSum)}
                {' '}
                (
                {discountAmount}
                )
              </Table.HeaderCell>
              <Table.HeaderCell collapsing>
                {formatPriceFull(discountedPriceSum)}
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Footer>
        </Table>
      </>
    );
  }
}

export default withTranslation()(withRouter(InvoiceProductList));
