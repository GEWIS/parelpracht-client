import React from 'react';
import {
  Button, Icon, Segment, Table,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { CustomProduct } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';
import CustomInvoiceProductRow from './CustomInvoiceProductRow';

interface Props {
  products: CustomProduct[];
  addProduct: () => void;
  removeProduct: (id: number) => void;
  updateProduct: (id: number, attribute: string, value: any) => void;
}

function CustomInvoiceProducts(props: Props) {
  const { t } = useTranslation();

  return (
    <Segment secondary style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'black' }}>
      <h2>
        {t('pages.customInvoice.products.header')}
        <Button
          icon
          labelPosition="left"
          floated="right"
          style={{ marginTop: '-0.5em' }}
          basic
          onClick={() => props.addProduct()}
        >
          <Icon name="plus" />
          {t('pages.customInvoice.products.addProduct')}
        </Button>
      </h2>
      <Table compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t('pages.customInvoice.products.name')}</Table.HeaderCell>
            <Table.HeaderCell>{t('pages.customInvoice.products.price')}</Table.HeaderCell>
            <Table.HeaderCell>{t('pages.customInvoice.products.amount')}</Table.HeaderCell>
            <Table.HeaderCell collapsing>{t('pages.customInvoice.products.total')}</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.products.map((product: CustomProduct, id: number) => (
            <CustomInvoiceProductRow
              product={product}
              id={id}
              key={id.toString()}
              updateProduct={props.updateProduct}
              removeProduct={props.removeProduct}
            />
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell />
            <Table.HeaderCell collapsing>
              {formatPriceFull(props.products.reduce((a, b) => a + b.amount * b.pricePerOne, 0))}
            </Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Footer>
      </Table>
    </Segment>
  );
}

export default CustomInvoiceProducts;
