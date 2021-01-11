export function formatLastUpdate(date: Date): string {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames[date.getMonth()];
  const day = String(date.getDate());
  const year = date.getFullYear();
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
  const time = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  return `${month} ${dayString}, ${year} at ${time}`;
}
