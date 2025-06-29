import { RootState } from '../store';
import { Roles } from '../../clients/server.generated';

export function authedUserHasRole(state: RootState, role: Roles): boolean {
  return state.auth.roles.includes(role);
}

export function authedUserHasOneOfRoles(state: RootState, roles: Roles[]): boolean {
  return roles.filter((r) => state.auth.roles.includes(r)).length > 0;
}

export function isAuthenticatedUser(state: RootState, id: number): boolean {
  if (state.auth.profile === undefined) return false;
  return state.auth.profile.id === id;
}
