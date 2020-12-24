import { ContactFunction } from '../clients/server.generated';

export function formatContactName(fName: string, mName: string, lName: string): string {
  let contactName: string = '';
  if (mName == null) {
    contactName = `${fName} ${lName}`;
  } else {
    contactName = `${fName} ${mName} ${lName}`;
  }
  return contactName;
}

export function formatFunction(func: ContactFunction) {
  switch (func) {
    case ContactFunction.NORMAL: return 'Normal contact';
    case ContactFunction.PRIMARY: return 'Primary contact';
    case ContactFunction.FINANCIAL: return 'Financial contact';
    case ContactFunction.OLD: return 'Old contact';
    default: return 'Unknown function';
  }
}
