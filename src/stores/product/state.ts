import { Product } from '../../clients/server.generated';
import ResourceStatus from '../resourceStatus';

export interface ProductState {
  list: Product[];
  listCount: number;
  listStatus: ResourceStatus;

  listSortColumn: string;
  listSortDirection: 'ASC' | 'DESC';
  listLastUpdated: Date;
  listSkip: number;
  listTake: number;
  listSearch: string;

  single: Product | undefined;
  singleStatus: ResourceStatus;
}
