import { Action } from 'redux';
import { AuthStatus, Gender, User } from '../../clients/server.generated';
import { NavigateFunction } from 'react-router/dist/lib/hooks';

// Action types
export enum AuthActionType {
  FetchStatus = 'Auth/FetchStatus',
  SetStatus = 'Auth/SetStatus',

  FetchProfile = 'Auth/FetchProfile',
  SetProfile = 'Auth/SetProfile',

  LoginLocal = 'Auth/LoginLocal',
  LoginLDAP = 'Auth/LoginLDAP',
  Logout = 'Auth/Logout',
  ForgotPassword = 'Auth/ForgotPassword',
  ResetPassword = 'Auth/ResetPassword',
  RequestSuccess = 'Auth/RequestSucess',
  RequestError = 'Auth/RequestError',
  RequestClear = 'Auth/RequestClear',

  GenerateApiKey = 'Auth/GenerateApiKey',
  GetApiKey = 'Auth/GetApiKey',
  SetApiKey = 'Auth/SetApiKey',
  RevokeApiKey = 'Auth/RevokeApiKey',

  Setup = 'Auth/Setup',
}

export type AuthFetchStatus = Action<AuthActionType.FetchStatus>;
export type AuthSetStatus = Action<AuthActionType.SetStatus> & {
  status: AuthStatus;
};

export type AuthFetchProfile = Action<AuthActionType.FetchProfile>;
export type AuthSetProfile = Action<AuthActionType.SetProfile> & {
  profile: User;
};

export type AuthLoginLocal = Action<AuthActionType.LoginLocal> & {
  email: string;
  password: string;
  rememberMe: boolean;
};
export type AuthLoginLDAP = Action<AuthActionType.LoginLDAP> & {
  username: string;
  password: string;
  rememberMe: boolean;
};
export type AuthLogout = Action<AuthActionType.Logout>;

export type AuthForgotPassword = Action<AuthActionType.ForgotPassword> & {
  email: string;
};
export type AuthResetPassword = Action<AuthActionType.ResetPassword> & {
  token: string;
  password: string;
  passwordRepeat: string;
};

export type AuthRequestSuccess = Action<AuthActionType.RequestSuccess>;
export type AuthRequestError = Action<AuthActionType.RequestError>;
export type AuthRequestClear = Action<AuthActionType.RequestClear>;

export type AuthGenerateApiKey = Action<AuthActionType.GenerateApiKey>;
export type AuthGetApiKey = Action<AuthActionType.GetApiKey>;
export type AuthSetApiKey = Action<AuthActionType.SetApiKey> & {
  apiKey: string | undefined;
};
export type AuthRevokeApiKey = Action<AuthActionType.RevokeApiKey>;

export type AuthSetup = Action<AuthActionType.Setup> & {
  email: string,
  firstname: string,
  lastname: string,
  gender: Gender,
  password: string,
  rememberMe: boolean,
  navigate: NavigateFunction
};
