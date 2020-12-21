import { Invoice } from '../../clients/server.generated';
import ResourceStatus from '../resourceStatus';

export interface InvoiceState {
  single: Invoice | undefined;
  singleStatus: ResourceStatus;
}
