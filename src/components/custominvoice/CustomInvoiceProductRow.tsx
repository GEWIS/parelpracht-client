import { ChangeEvent, useState } from 'react';
import { Button, Input, Table, Dropdown } from 'semantic-ui-react';
import validator from 'validator';
import { useTranslation } from 'react-i18next';
import { CustomProduct, VAT } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';

interface Props {
  product: CustomProduct;
  id: number;

  updateProduct: <T extends keyof CustomProduct = keyof CustomProduct>(
    id: number,
    attribute: T,
    value: CustomProduct[T],
  ) => void;

  removeProduct: (id: number) => void;
}

function CustomInvoiceProductRow(props: Props) {
  const { t } = useTranslation();

  const [pricePerOne, changePricePerOne] = useState('0.00');

  return (
    <Table.Row>
      <Table.Cell width="2">
        <Input
          placeholder={t('pages.customInvoice.products.amount')}
          value={props.product.amount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            props.updateProduct(props.id, 'amount', Number(e.target.value));
          }}
          error={props.product.amount === 0 || !Number.isInteger(props.product.amount)}
          fluid
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          placeholder={t('pages.customInvoice.products.name')}
          value={props.product.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            props.updateProduct(props.id, 'name', e.target.value);
          }}
          error={validator.isEmpty(props.product.name)}
          fluid
        />
      </Table.Cell>
      <Table.Cell width="3">
        <Input
          placeholder={t('pages.customInvoice.products.price')}
          value={pricePerOne}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            props.updateProduct(props.id, 'pricePerOne', parseFloat(e.target.value.replace(',', '.')) * 100);
            changePricePerOne(e.target.value);
          }}
          error={props.product.pricePerOne === 0}
          fluid
          icon="euro"
          iconPosition="left"
        />
      </Table.Cell>
      <Table.Cell width="2">
        <Dropdown
          selection
          placeholder={VAT.HIGH}
          value={props.product.valueAddedTax}
          options={[
            { key: 0, text: '21%', value: VAT.HIGH },
            { key: 1, text: '9%', value: VAT.LOW },
            { key: 2, text: '0%', value: VAT.ZERO },
          ]}
          onChange={(_, data) => {
            props.updateProduct(props.id, 'valueAddedTax', data.value as VAT);
          }}
          fluid
        />
      </Table.Cell>
      <Table.Cell width="2">{formatPriceFull(props.product.amount * props.product.pricePerOne)}</Table.Cell>
      <Table.Cell collapsing>
        <Button
          color="red"
          icon="trash"
          size="tiny"
          onClick={() => props.removeProduct(props.id)}
          title={t('pages.customInvoice.products.deleteButton')}
        />
      </Table.Cell>
    </Table.Row>
  );
}

export default CustomInvoiceProductRow;
