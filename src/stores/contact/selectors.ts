import { Contact } from '../../clients/server.generated';
import { RootState } from '../store';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';

export function sortColumn(state: RootState): string {
  const column = getTable<Contact>(state, Tables.Contacts).sortColumn;
  switch (column) {
    case 'CompanyId': return 'Company ID';
    case 'firstName': return 'First Name';
    case 'middleName': return 'Middle Name';
    case 'lastName': return 'Last Name';
    case 'gender': return 'Gender';
    case 'email': return 'E-mail';
    case 'comment': return 'Comment';
    default: return 'unknown';
  }
}
