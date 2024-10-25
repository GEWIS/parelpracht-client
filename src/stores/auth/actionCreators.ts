import { AuthStatus, Gender, User } from '../../clients/server.generated';
import {
  AuthActionType, AuthFetchProfile, AuthFetchStatus,
  AuthForgotPassword,
  AuthGenerateApiKey,
  AuthGetApiKey, AuthLoginLDAP,
  AuthLoginLocal, AuthLogout, AuthRequestClear, AuthRequestError, AuthRequestSuccess,
  AuthResetPassword, AuthRevokeApiKey, AuthSetApiKey, AuthSetProfile, AuthSetStatus, AuthSetup,
} from './actions';
import { NavigateFunction } from 'react-router/dist/lib/hooks';

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

export function authLoginLocal(
  email: string, password: string, rememberMe: boolean,
): AuthLoginLocal {
  return {
    type: AuthActionType.LoginLocal, email, password, rememberMe,
  };
}

export function authLoginLDAP(
  username: string, password: string, rememberMe: boolean,
): AuthLoginLDAP {
  return {
    type: AuthActionType.LoginLDAP, username, password, rememberMe,
  };
}

export function authLogout(): AuthLogout {
  return { type: AuthActionType.Logout };
}

export function authForgotPassword(email: string): AuthForgotPassword {
  return { type: AuthActionType.ForgotPassword, email };
}

export function authResetPassword(
  password: string, passwordRepeat: string, token: string,
): AuthResetPassword {
  return {
    type: AuthActionType.ResetPassword, password, passwordRepeat, token,
  };
}

export function authRequestSuccess(): AuthRequestSuccess {
  return { type: AuthActionType.RequestSuccess };
}

export function authRequestError(): AuthRequestError {
  return { type: AuthActionType.RequestError };
}

export function authRequestClear(): AuthRequestClear {
  return { type: AuthActionType.RequestClear };
}

export function authGenerateApiKey(): AuthGenerateApiKey {
  return { type: AuthActionType.GenerateApiKey };
}

export function authGetApiKey(): AuthGetApiKey {
  return { type: AuthActionType.GetApiKey };
}

export function authRevokeApiKey(): AuthRevokeApiKey {
  return { type: AuthActionType.RevokeApiKey };
}

export function authSetApiKey(apiKey: string | undefined): AuthSetApiKey {
  return { type: AuthActionType.SetApiKey, apiKey };
}

export function authSetup(
  email: string,
  firstname: string,
  lastname: string,
  gender: Gender,
  password: string,
  rememberMe: boolean,
  navigate: NavigateFunction): AuthSetup {
  return {
    type: AuthActionType.Setup, email, firstname, lastname, gender, password, rememberMe, navigate,
  };
}
