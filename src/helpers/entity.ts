import { useTranslation } from 'react-i18next';
import { SingleEntities } from '../stores/single/single';

export function formatEntity(entity: SingleEntities) {
  const { t } = useTranslation();

  return t(`entity.${entity.toLowerCase()}`);
}
