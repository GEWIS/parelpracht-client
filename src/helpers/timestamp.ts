import i18n, { getLanguage } from '../localization';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

interface SplitDate {
  month: string,
  day: string,
  year: string,
  hour: string,
  minutes: string,
}

function parseDateToSplitDateObj(date: Date): SplitDate {
  const day = String(date.getDate());
  let dayString: string;
  if (day === '1') {
    dayString = '1st';
  } else if (day === '2') {
    dayString = '2nd';
  } else if (day === '3') {
    dayString = '3rd';
  } else {
    dayString = `${day}th`;
  }
  return {
    month: monthNames[date.getMonth()],
    day: dayString,
    year: date.getFullYear().toString(),
    hour: String(date.getHours()).padStart(2, '0'),
    minutes: String(date.getMinutes()).padStart(2, '0'),
  } as SplitDate;
}

export function formatLastUpdate(date: Date): string {
  return `${date.toLocaleString(getLanguage(), {
    year: 'numeric', month: 'long', day: 'numeric',
  })} ${i18n.t('other.dateTime.at')} ${date.toLocaleString(getLanguage(), {
    hour: '2-digit', minute: '2-digit',
  })}`;
}

export function formatTimestampToDate(date: Date): string {
  const d = parseDateToSplitDateObj(date);
  return `${d.month} ${d.day}, ${d.year}`;
}

export function formatTimestampToDateShort(date: Date): string {
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
}

export function parseFinancialYear(year: number): string {
  return `${year - 1} - ${year}`;
}

export function dateToFinancialYear(date: Date): number {
  // January up to and including June
  if (date.getMonth() < 6) {
    return date.getFullYear();
  }
  return date.getFullYear() + 1;
}

export function dateToFullFinancialYear(date: Date): string {
  const finYear = dateToFinancialYear(date);
  return parseFinancialYear(finYear);
}

export function formatDateToString(date: Date) {
  let day = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  const year = date.getFullYear().toString();

  if (Number(day) < 10) { day = `0${day}`; }
  if (Number(month) < 10) { month = `0${month}`; }

  return `${year}-${month}-${day}`;
}

export function isInvalidDate(date: Date) {
  return !(date instanceof Date && !Number.isNaN(date.getDate()));
}

export function formatDateForDateInput(date: Date, dateValue: string) {
  let formattedDate: string = formatDateToString(date);

  if (dateValue.length !== 10 || isInvalidDate(date)) {
    formattedDate = dateValue;
  }
  return formattedDate;
}
