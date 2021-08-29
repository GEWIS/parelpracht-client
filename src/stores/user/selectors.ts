import { User, UserSummary } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import { getSingle } from '../single/selectors';
import { SingleEntities } from '../single/single';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import i18n from '../../localization';

export function sortColumn(state: RootState): string {
  const column = getTable<User>(state, Tables.Users).sortColumn;
  switch (column) {
    case 'id': return i18n.t('entities.generalProps.ID');
    case 'firstName': return i18n.t('entities.user.props.firstName').toLowerCase();
    case 'email': return i18n.t('entities.user.props.personalEmail').toLowerCase();
    default: return i18n.t('entities.generalProps.unknown').toLowerCase();
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

export function getUserBackground(state: RootState, id: number): string {
  const user = getSummary<UserSummary>(
    state, SummaryCollections.Users, id,
  );
  if (user === undefined) return '';
  return user.backgroundFilename;
}

// Returns whether the single user inspected is the authenticated user.
// In other words: if the user is viewing his/her profile page
export function isProfile(state: RootState): boolean {
  const user = getSingle<User>(state, SingleEntities.User).data;
  return user?.id === state.auth.profile?.id;
}
