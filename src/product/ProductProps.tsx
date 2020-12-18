import React, {
  useState, ChangeEvent, SetStateAction, Dispatch,
} from 'react';

import {
  Dimmer, Form, Input, Loader, Segment,
} from 'semantic-ui-react';
import { Product } from '../clients/server.generated';
import ResourceStatus from '../stores/resourceStatus';

interface Props {
  product: Product | undefined;
  status: ResourceStatus;
}

export function ProductProps(props: Props) {
  const { product, status } = props;

  if (status !== ResourceStatus.FETCHED || product === undefined) {
    return (
      <Segment>
        <h3>Details</h3>
        <Dimmer active inverted>
          <Loader inverted content="Loading" />
        </Dimmer>
      </Segment>
    );
  }

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
