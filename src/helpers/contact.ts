import { TFunction } from 'i18next';
import {
  Contact, ContactFunction, ContactSummary, Gender,
} from '../clients/server.generated';

export function formatContactName(
  fName: string | undefined,
  mName: string | undefined,
  lName: string | undefined,
): string {
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

export function formatFunctionShort(func: ContactFunction) {
  switch (func) {
    case ContactFunction.NORMAL: return 'Normal';
    case ContactFunction.PRIMARY: return 'Primary';
    case ContactFunction.FINANCIAL: return 'Financial';
    case ContactFunction.OLD: return 'Old';
    default: {
      return 'Unknown';
    }
  }
}

export function formatGender(gender: Gender, t: TFunction) {
  switch (gender) {
    case Gender.MALE: return t('entities.user.props.gender.male');
    case Gender.FEMALE: return t('entities.user.props.gender.female');
    case Gender.OTHER: return t('entities.user.props.gender.other');
    case Gender.UNKNOWN:
    default: return t('entities.user.props.gender.unknown');
  }
}

export function sortContactsByFunction(
  contacts: Contact[] | ContactSummary[],
  sortAlphabetically?: boolean,
): Contact[] | ContactSummary[] {
  if (sortAlphabetically) {
    contacts.sort((c1, c2) => {
      const n1 = formatContactName(c1.firstName, c1.lastNamePreposition, c1.lastName).toUpperCase();
      const n2 = formatContactName(c2.firstName, c2.lastNamePreposition, c2.lastName).toUpperCase();
      if (n1 < n2) return -1;
      if (n1 > n2) return 1;
      return 0;
    });
  }

  contacts.sort((c1, c2) => {
    switch (c1.function) {
      case ContactFunction.PRIMARY: return -1;
      case ContactFunction.NORMAL:
        switch (c2.function) {
          case ContactFunction.PRIMARY: return 1;
          case ContactFunction.NORMAL: return 0;
          case ContactFunction.FINANCIAL: return -1;
          case ContactFunction.OLD: return -1;
          default: return 0;
        }
      case ContactFunction.FINANCIAL:
        switch (c2.function) {
          case ContactFunction.PRIMARY: return 1;
          case ContactFunction.NORMAL: return 1;
          case ContactFunction.FINANCIAL: return 0;
          case ContactFunction.OLD: return -1;
          default: return 0;
        }
      case ContactFunction.OLD: return 1;
      default: return 0;
    }
  });

  return contacts;
}
