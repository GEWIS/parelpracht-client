import { AuthStatus, Profile } from '../../clients/server.generated';
import ResourceStatus from '../resourceStatus';

export interface AuthState {
  authStatus: AuthStatus | undefined;
  status: ResourceStatus;

  profile: Profile | undefined;
  roles: string[];
  profileStatus: ResourceStatus;

  passwordRequest: ResourceStatus;

  apiKey: string | undefined;
  apiKeyRequest: ResourceStatus;
}
