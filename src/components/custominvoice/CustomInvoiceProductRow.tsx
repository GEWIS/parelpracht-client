import React, { ChangeEvent, useState } from 'react';
import { Button, Input, Table } from 'semantic-ui-react';
import validator from 'validator';
import { CustomProduct } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';

interface Props {
  product: CustomProduct;
  id: number;

  updateProduct: (id: number, attribute: string, value: any) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  removeProduct: (id: number) => void;
}

function CustomInvoiceProductRow(props: Props) {
  const [pricePerOne, changePricePerOne] = useState('0.00');

  // @ts-ignore
  return (
    <Table.Row>
      <Table.Cell>
        <Input
          placeholder="Name"
          value={props.product.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            props.updateProduct(props.id, 'name', e.target.value);
          }}
          error={validator.isEmpty(props.product.name)}
          fluid
        />
      </Table.Cell>
      <Table.Cell width="4">
        <Input
          placeholder="Price"
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
      <Table.Cell width="3">
        <Input
          placeholder="Amount"
          value={props.product.amount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            props.updateProduct(props.id, 'amount', e.target.value);
          }}
          // @ts-ignore
          error={props.product.amount === 0 || !validator.isInt(props.product.amount)}
          fluid
        />
      </Table.Cell>
      <Table.Cell collapsing>
        {formatPriceFull(props.product.amount * props.product.pricePerOne)}
      </Table.Cell>
      <Table.Cell collapsing>
        <Button
          color="red"
          icon="trash"
          size="tiny"
          onClick={() => props.removeProduct(props.id)}
        />
      </Table.Cell>
    </Table.Row>
  );
}

export default CustomInvoiceProductRow;
