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
};
export type AuthLogout = Action<AuthActionType.Logout>;
