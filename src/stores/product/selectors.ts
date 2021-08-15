import { Product, ProductSummary } from '../../clients/server.generated';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import i18n, { getLanguage } from '../../localization';

export function sortColumn(state: RootState): string {
  const column = getTable<Product>(state, Tables.Products).sortColumn;
  switch (column) {
    case 'id': return i18n.t('entities.generalProps.ID');
    case 'nameDutch': return i18n.t('entities.product.props.nameNl').toLowerCase();
    case 'nameEnglish': return i18n.t('entities.product.props.nameEn').toLowerCase();
    case 'targetPrice': return i18n.t('entities.product.props.price').toLowerCase();
    case 'status': return i18n.t('entities.generalProps.status').toLowerCase();
    case 'category': return i18n.t('entity.category').toLowerCase();
    default: return i18n.t('entities.generalProps.unknown').toLowerCase();
  }
}

export function getProductName(state: RootState, id: number): string {
  const currentLanguage = getLanguage();

  if (currentLanguage === 'nl-NL') {
    return getSummary<ProductSummary>(
      state, SummaryCollections.Products, id,
    )?.nameDutch ?? '...';
  }
  return getSummary<ProductSummary>(
    state, SummaryCollections.Products, id,
  )?.nameEnglish ?? '...';
}
