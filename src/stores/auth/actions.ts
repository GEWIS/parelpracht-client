import { Action } from 'redux';
import { AuthStatus, User } from '../../clients/server.generated';

// Action types
export enum AuthActionType {
  FetchStatus = 'Auth/FetchStatus',
  SetStatus = 'Auth/SetStatus',

  FetchProfile = 'Auth/FetchProfile',
  SetProfile = 'Auth/SetProfile',

  Login = 'Auth/Login',
  Logout = 'Auth/Logout',
  ForgotPassword = 'Auth/ForgotPassword',
  ResetPassword = 'Auth/ResetPassword',
  RequestSuccess = 'Auth/RequestSucess',
  RequestError = 'Auth/RequestError',
  RequestClear = 'Auth/RequestClear',
}

export type AuthFetchStatus = Action<AuthActionType.FetchStatus>;
export type AuthSetStatus = Action<AuthActionType.SetStatus> & {
  status: AuthStatus;
};

export type AuthFetchProfile = Action<AuthActionType.FetchProfile>;
export type AuthSetProfile = Action<AuthActionType.SetProfile> & {
  profile: User;
};

export type AuthLogin = Action<AuthActionType.Login> & {
  email: string;
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
