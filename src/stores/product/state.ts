import { Product } from '../../clients/server.generated';
import ResourceStatus from '../resourceStatus';

export interface ProductState {
  list: Product[];
  listStatus: ResourceStatus;
  listSortColumn: string;
  listSortDirection: 'asc' | 'desc';

  single: Product | undefined;
  singleStatus: ResourceStatus;
}
