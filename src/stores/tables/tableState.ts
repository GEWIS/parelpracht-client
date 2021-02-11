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

  filters: ListFilter[],

  // Only used for the invoices table. This attribute contains the last time at which the treasurer
  // has updated the table.
  lastSeen?: Date,
}

export interface ListFilter {
  column: string;
  values: any[];
}
