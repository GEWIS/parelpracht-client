import { Contact, ContactSummary } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';

export function sortColumn(state: RootState): string {
  const column = getTable<Contact>(state, Tables.Contacts).sortColumn;
  switch (column) {
    case 'id': return 'ID';
    case 'CompanyId': return 'Company ID';
    case 'firstName': return 'First Name';
    case 'lastNamePreposition': return 'Middle Name';
    case 'lastName': return 'Last Name';
    case 'gender': return 'Gender';
    case 'email': return 'E-mail';
    case 'comment': return 'Comment';
    default: return 'unknown';
  }
}

export function getContactName(state: RootState, id: number): string {
  const contact = getSummary<ContactSummary>(
    state, SummaryCollections.Contacts, id,
  );
  if (contact === undefined) return '...';
  return formatContactName(contact.firstName, contact.lastNamePreposition, contact.lastName);
}
