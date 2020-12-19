import React, {
  useState, ChangeEvent,
} from 'react';

import {
  Form, Input, Segment,
} from 'semantic-ui-react';
import { Product } from '../clients/server.generated';

interface Props {
  product: Product;
}

export function ProductProps(props: Props) {
  const { product } = props;

  const [nameDutch, setNameDutch] = useState(product.nameDutch);
  const [nameEnglish, setNameEnglish] = useState(product.nameEnglish);

  return (
    <Segment>
      <h3>Details</h3>
      <Form>
        <Form.Group widths="equal">
          <Form.Field
            id="form-input-dutch-name"
            fluid
            control={Input}
            label="Name (Dutch)"
            value={nameDutch}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNameDutch(e.target.value)}
          />
          <Form.Field
            fluid
            id="form-input-english-name"
            control={Input}
            label="Name (English)"
            value={nameEnglish}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNameEnglish(e.target.value)}
          />
        </Form.Group>
      </Form>
    </Segment>
  );
}
