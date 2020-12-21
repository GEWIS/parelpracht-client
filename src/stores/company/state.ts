import { Company } from '../../clients/server.generated';
import ResourceStatus from '../resourceStatus';

export interface CompanyState {
  single: Company | undefined;
  singleStatus: ResourceStatus;
}
