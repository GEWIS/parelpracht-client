import ResourceStatus from '../resourceStatus';

export interface SingleEntityState<R> {
  data: R | undefined,
  status: ResourceStatus,
}
