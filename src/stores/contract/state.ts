import { Contract } from '../../clients/server.generated';
import ResourceStatus from '../resourceStatus';

export interface ContractState {
  single: Contract | undefined;
  singleStatus: ResourceStatus;
}
