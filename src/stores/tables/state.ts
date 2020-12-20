import ResourceStatus from '../resourceStatus';

export interface TableState<R> {
  data: R[];
  count: number;
  status: ResourceStatus;
  lastUpdated: Date;

  sortColumn: string;
  sortDirection: 'ASC' | 'DESC';
  skip: number;
  take: number;
  search: string;
}
