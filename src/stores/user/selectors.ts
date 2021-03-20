import { User, UserSummary } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import { getSingle } from '../single/selectors';
import { SingleEntities } from '../single/single';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';

export function sortColumn(state: RootState): string {
  const column = getTable<User>(state, Tables.Users).sortColumn;
  switch (column) {
    case 'id': return 'ID';
    case 'firstName': return 'First Name';
    case 'lastNamePreposition': return 'Middle Name';
    case 'lastName': return 'Last Name';
    case 'gender': return 'Gender';
    case 'email': return 'E-mail';
    case 'comment': return 'Comment';
    default: return 'unknown';
  }
}

export function getUserName(state: RootState, id: number): string {
  const user = getSummary<UserSummary>(
    state, SummaryCollections.Users, id,
  );
  if (user === undefined) return '...';
  return formatContactName(user.firstName, user.lastNamePreposition, user.lastName);
}

export function getUserFirstName(state: RootState, id: number): string {
  const user = getSummary<UserSummary>(
    state, SummaryCollections.Users, id,
  );
  if (user === undefined) return '...';
  return user.firstName;
}

export function getUserAvatar(state: RootState, id: number): string {
  const user = getSummary<UserSummary>(
    state, SummaryCollections.Users, id,
  );
  if (user === undefined) return '';
  return user.avatarFilename;
}

// Returns whether the single user inspected is the authenticated user.
// In other words: if the user is viewing his/her profile page
export function isProfile(state: RootState): boolean {
  const user = getSingle<User>(state, SingleEntities.User).data;
  return user?.id === state.auth.profile?.id;
}
