import { ProductInstanceStatus } from '../clients/server.generated';
import i18n from '../localization';

export function prodInsStatus(status: ProductInstanceStatus) {
  switch (status) {
    case ProductInstanceStatus.NOTDELIVERED:
      return i18n.t('entities.status.notDelivered');
    case ProductInstanceStatus.DELIVERED:
      return i18n.t('entities.status.delivered');
    case ProductInstanceStatus.DEFERRED:
      return i18n.t('entities.status.deferred');
    case ProductInstanceStatus.CANCELLED:
      return i18n.t('entities.status.cancelled');
    default:
      throw new TypeError(`Unknown ProductInstanceStatus ${status as string}`);
  }
}
