import { ProductInstanceStatus } from '../clients/server.generated';

export function prodInsStatus(status: ProductInstanceStatus) {
  switch (status) {
    case ProductInstanceStatus.NOTDELIVERED:
      return 'Not delivered';
    case ProductInstanceStatus.DELIVERED:
      return 'Delivered';
    case ProductInstanceStatus.DEFERRED:
      return 'Deferred';
    case ProductInstanceStatus.CANCELLED:
      return 'Cancelled';
    default:
      throw new TypeError(`Unknown ProductInstanceStatus ${status}`);
  }
}
