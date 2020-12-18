import { Product } from '../../clients/server.generated';
import ResourceStatus from '../resourceStatus';

export interface ProductState {
  list: Product[];
  listStatus: ResourceStatus;

  single: Product | undefined;
  singleStatus: ResourceStatus;
}
