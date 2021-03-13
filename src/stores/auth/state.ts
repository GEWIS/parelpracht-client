import { AuthStatus, User } from '../../clients/server.generated';
import ResourceStatus from '../resourceStatus';

export interface AuthState {
  authStatus: AuthStatus | undefined;
  status: ResourceStatus;

  profile: User | undefined;
  roles: string[];
  profileStatus: ResourceStatus;

  passwordRequest: ResourceStatus;
}
