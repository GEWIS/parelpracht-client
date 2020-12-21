import { Product } from '../../clients/server.generated';
import ResourceStatus from '../resourceStatus';

export interface ProductState {
  single: Product | undefined;
  singleStatus: ResourceStatus;
}
