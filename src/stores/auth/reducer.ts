import ResourceStatus from '../resourceStatus';
import * as actionCreators from './actionCreators';
import { AuthActionType, AuthSetApiKey } from './actions';
import { AuthState } from './state';

const initialState: AuthState = {
  authStatus: undefined,
  status: ResourceStatus.EMPTY,

  profile: undefined,
  profileStatus: ResourceStatus.EMPTY,

  passwordRequest: ResourceStatus.EMPTY,

  apiKey: undefined,
  apiKeyRequest: ResourceStatus.EMPTY,
};

type AuthAction = ReturnType<typeof actionCreators[keyof typeof actionCreators]>;

export default function authReducer(
  state: AuthState = initialState, action: AuthAction,
): AuthState {
  switch (action.type) {
    case AuthActionType.FetchStatus:
      return {
        ...state,
        status: ResourceStatus.FETCHING,
      };
    case AuthActionType.SetStatus:
      return {
        ...state,
        authStatus: action.status,
        status: ResourceStatus.FETCHED,
      };
    case AuthActionType.FetchProfile:
      return {
        ...state,
        profileStatus: ResourceStatus.FETCHING,
      };
    case AuthActionType.SetProfile:
      return {
        ...state,
        profile: action.profile,
        profileStatus: ResourceStatus.FETCHED,
      };
    case AuthActionType.Logout:
      return {
        ...state,
        profile: undefined,
        profileStatus: ResourceStatus.EMPTY,
      };
    case AuthActionType.ResetPassword:
    case AuthActionType.ForgotPassword:
      return {
        ...state,
        passwordRequest: ResourceStatus.FETCHING,
      };
    case AuthActionType.RequestClear:
      return {
        ...state,
        passwordRequest: ResourceStatus.EMPTY,
      };
    case AuthActionType.RequestSuccess:
      return {
        ...state,
        passwordRequest: ResourceStatus.FETCHED,
      };
    case AuthActionType.RequestError:
      return {
        ...state,
        passwordRequest: ResourceStatus.ERROR,
      };
    case AuthActionType.GetApiKey:
    case AuthActionType.GenerateApiKey:
      return {
        ...state,
        apiKeyRequest: ResourceStatus.FETCHING,
      };
    case AuthActionType.RevokeApiKey:
      return {
        ...state,
        apiKeyRequest: ResourceStatus.DELETING,
      };
    case AuthActionType.SetApiKey:
      return {
        ...state,
        apiKey: (action as AuthSetApiKey).apiKey,
        apiKeyRequest: ResourceStatus.FETCHED,
      };
    default:
      return state;
  }
}
