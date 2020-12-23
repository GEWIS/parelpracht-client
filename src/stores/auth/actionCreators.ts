import { AuthStatus, User } from '../../clients/server.generated';
import {
  AuthActionType, AuthFetchProfile, AuthFetchStatus,
  AuthLogin, AuthLogout, AuthSetProfile, AuthSetStatus,
} from './actions';

export function authFetchStatus(): AuthFetchStatus {
  return { type: AuthActionType.FetchStatus };
}

export function authSetStatus(status: AuthStatus): AuthSetStatus {
  return { type: AuthActionType.SetStatus, status };
}

export function authFetchProfile(): AuthFetchProfile {
  return { type: AuthActionType.FetchProfile };
}

export function authSetProfile(profile: User): AuthSetProfile {
  return { type: AuthActionType.SetProfile, profile };
}

export function authLogin(email: string, password: string): AuthLogin {
  return { type: AuthActionType.Login, email, password };
}

export function authLogout(): AuthLogout {
  return { type: AuthActionType.Logout };
}
