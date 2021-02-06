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
    year: date.getFullYear(),
    hour: String(date.getHours()).padStart(2, '0'),
    minutes: String(date.getMinutes()).padStart(2, '0'),
  } as any as SplitDate;
}

export function formatLastUpdate(date: Date): string {
  const d = parseDateToSplitDateObj(date);
  return `${d.month} ${d.day}, ${d.year} at ${d.hour}:${d.minutes}`;
}

export function formatTimestampToDate(date: Date): string {
  const d = parseDateToSplitDateObj(date);
  return `${d.month} ${d.day}, ${d.year}`;
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
  return `${finYear - 1} - ${finYear}`;
}
