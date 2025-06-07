import { Contact, ContactSummary } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import i18n from '../../localization';

export function sortColumn(state: RootState): string {
  const column = getTable<Contact>(state, Tables.Contacts).sortColumn;
  switch (column) {
    case 'id':
      return i18n.t('entities.generalProps.ID');
    case 'company':
      return i18n.t('entity.company').toLowerCase();
    case 'firstName':
      return i18n.t('entities.contact.props.firstName').toLowerCase();
    case 'email':
      return i18n.t('entities.contact.props.email').toLowerCase();
    default:
      return i18n.t('entities.generalProps.unknown').toLowerCase();
  }
}

export function getContactName(state: RootState, id: number): string {
  const contact = getSummary<ContactSummary>(state, SummaryCollections.Contacts, id);
  if (contact === undefined) return '...';
  return formatContactName(contact.firstName, contact.lastNamePreposition, contact.lastName);
}
