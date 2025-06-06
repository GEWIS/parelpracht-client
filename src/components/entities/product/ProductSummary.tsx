import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Product } from '../../../clients/server.generated';
import { formatPriceFull } from '../../../helpers/monetary';
import ResourceStatus from '../../../stores/resourceStatus';
import { getSingle } from '../../../stores/single/selectors';
import { SingleEntities } from '../../../stores/single/single';
import { RootState } from '../../../stores/store';
import { getCategoryName } from '../../../stores/productcategory/selectors';
import { EntitySummary } from '../EntitySummary';
import { getLanguage } from '../../../localization';

interface Props {
  product: Product | undefined;
  status: ResourceStatus;
  categoryName: string;
}

function ProductSummary(props: Props) {
  const { product, status, categoryName } = props;
  const { t } = useTranslation();

  if (product === undefined) {
    return (
      <EntitySummary
        loading
        entity={SingleEntities.Product}
        icon="shopping bag"
      />
    );
  }

  const useDutch = getLanguage() === 'nl-NL';

  const loading = (status !== ResourceStatus.FETCHED
    && status !== ResourceStatus.SAVING
    && status !== ResourceStatus.ERROR);

  return (
    <EntitySummary
      loading={loading}
      entity={SingleEntities.Product}
      icon="shopping bag"
      title={useDutch ? product.nameDutch : product.nameEnglish}
    >
      { useDutch ? (
        <div>
          <h5>{t('entities.product.props.nameEn')}</h5>
          <p>{product.nameEnglish}</p>
        </div>
      ) : (
        <div>
          <h5>{t('entities.product.props.nameNl')}</h5>
          <p>{product.nameDutch}</p>
        </div>
      )}
      <div>
        <h5>{t('entities.product.props.price')}</h5>
        <p>{formatPriceFull(product.targetPrice)}</p>
      </div>
      <div>
        <h5>{t('entities.product.props.category')}</h5>
        <p>{categoryName}</p>
      </div>
    </EntitySummary>
  );
}

const mapStateToProps = (state: RootState, props: { product: Product }) => {
  return {
    product: getSingle<Product>(state, SingleEntities.Product).data,
    status: getSingle<Product>(state, SingleEntities.Product).status,
    categoryName: getCategoryName(state, props.product.categoryId),
  };
};

export default connect(mapStateToProps)(ProductSummary);
