import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import InvoiceProductRow from './InvoiceProductRow';
import {
  Client, Invoice, InvoiceStatus, ValueAddedTax,
} from '../../../clients/server.generated';
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

  enumToVatAmount = (valueAddedTax: ValueAddedTax) => {
    switch (valueAddedTax) {
      case ValueAddedTax.LOW:
        return 1.09;
      case ValueAddedTax.HIGH:
        return 1.21;
      default:
        return 1;
    }
  };

  deleteButtonActive() {
    const { activities } = this.props.invoice;
    return !(activities.find((a) => a.subType === InvoiceStatus.SENT) !== undefined
      || activities.find((a) => a.subType === InvoiceStatus.PAID) !== undefined
      || activities.find((a) => a.subType === InvoiceStatus.IRRECOVERABLE) !== undefined
      || activities.find((a) => a.subType === InvoiceStatus.CANCELLED) !== undefined);
  }

  public render() {
    const { invoice, t } = this.props;

    const { products } = invoice;
    let priceSum = 0;
    let discountAmount = 0;
    let discountSum = 0;
    let priceSumVAT = 0;
    let lowVATsum = 0;
    let highVATsum = 0;

    invoice.products.forEach((p) => {
      priceSum += p.basePrice;
      discountSum += p.discount;
      if (p.discount !== 0) discountAmount++;

      const currentPrice = p.basePrice - p.discount;
      const currentPriceVAT = currentPrice * this.enumToVatAmount(p.product.valueAddedTax);
      priceSumVAT += currentPriceVAT;
      if (p.product.valueAddedTax === ValueAddedTax.LOW) {
        lowVATsum += currentPriceVAT - currentPrice;
      }
      if (p.product.valueAddedTax === ValueAddedTax.HIGH) {
        highVATsum += currentPriceVAT - currentPrice;
      }
    });

    return (
      <>
        <h3>
          {t('entity.productinstances')}
        </h3>
        <Table compact unstackable>
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
                <b>{t('entities.productInstance.props.realPriceNoVat')}</b>
                <br />
                <b>{t('entities.productInstance.props.priceLowVat')}</b>
                <br />
                <b>{t('entities.productInstance.props.priceHighVat')}</b>
              </Table.HeaderCell>
              <Table.HeaderCell singleLine collapsing>
                {formatPriceFull(discountSum)}
                {' '}
                (
                {discountAmount}
                )
                <br />
                <br />
                <br />
              </Table.HeaderCell>
              <Table.HeaderCell collapsing>
                {formatPriceFull(priceSum - discountSum)}
                <br />
                {formatPriceFull(lowVATsum)}
                <br />
                {formatPriceFull(highVATsum)}
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>
                <b>{t('entities.productInstance.props.realPriceWithVat')}</b>
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell collapsing>
                {formatPriceFull(priceSumVAT)}
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
