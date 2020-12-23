import ResourceStatus from '../resourceStatus';
import * as actionCreators from './actionCreators';
import { AuthActionType } from './actions';
import { AuthState } from './state';

const initialState: AuthState = {
  authStatus: undefined,
  status: ResourceStatus.EMPTY,

  profile: undefined,
  profileStatus: ResourceStatus.EMPTY,
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
    default:
      return state;
  }
}
