import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button } from 'semantic-ui-react';
import { fetchSingle } from '../../stores/single/actionCreators';
import { SingleEntities } from '../../stores/single/single';
import { Client } from '../../clients/server.generated';

interface Props {
  fetchProduct: (id: number) => void;
  productId: number;
}

function CreatePricing(props: Props) {
  const createPricing = async () => {
    const client = new Client();
    await client.addPricing(props.productId);
    props.fetchProduct(props.productId);
  };

  return (
    <Button
      primary
      onClick={() => createPricing()}
    >
      Add pricing
    </Button>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProduct: (id: number) => dispatch(fetchSingle(SingleEntities.Product, id)),
});

export default connect(null, mapDispatchToProps)(CreatePricing);
