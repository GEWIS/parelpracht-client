import ResourceStatus from '../resourceStatus';

export interface SummaryBase {
  id: number;
}

export interface SummaryCollectionState<R extends SummaryBase> {
  options: R[];
  lookup: {
    [key: number]: R;
  };
  status: ResourceStatus;
  lastUpdated: Date;
}
