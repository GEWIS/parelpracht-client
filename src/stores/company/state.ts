import { Company } from '../../clients/server.generated';
import ResourceStatus from '../resourceStatus';

export interface CompanyState {
  list: Company[];
  listCount: number;
  listStatus: ResourceStatus;

  listSortColumn: string;
  listSortDirection: 'ASC' | 'DESC';
  listLastUpdated: Date;
  listSkip: number;
  listTake: number;
  listSearch: string;

  single: Company | undefined;
  singleStatus: ResourceStatus;
}
