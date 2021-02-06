import { ContactFunction, Gender } from '../clients/server.generated';

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

export function formatGender(gender: Gender) {
  switch (gender) {
    case Gender.MALE: return 'Male';
    case Gender.FEMALE: return 'Female';
    case Gender.OTHER: return 'Other gender';
    case Gender.UNKNOWN: return 'Unknown gender';
    default: return 'Unknown gender';
  }
}
