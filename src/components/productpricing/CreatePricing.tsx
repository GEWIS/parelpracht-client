import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button } from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { fetchSingle } from '../../stores/single/actionCreators';
import { SingleEntities } from '../../stores/single/single';
import { Client } from '../../clients/server.generated';

interface Props extends WithTranslation {
  fetchProduct: (id: number) => void;
  productId: number;
}

function CreatePricing(props: Props) {
  const createPricing = async () => {
    const client = new Client();
    await client.addPricing(props.productId);
    props.fetchProduct(props.productId);
  };
  const { t } = props;

  return (
    <Button primary onClick={() => createPricing()}>
      {t('entities.product.props.customPriceButton')}
    </Button>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchProduct: (id: number) => dispatch(fetchSingle(SingleEntities.Product, id)),
});

export default withTranslation()(connect(null, mapDispatchToProps)(CreatePricing));
