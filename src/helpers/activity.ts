import { ActivityType } from '../clients/server.generated';
import { formatLastUpdate } from './lastUpdate';

export function formatActivityType(activityType: ActivityType): string {
  if (activityType === 'COMMENT') {
    return 'Comment';
  }
  return 'Status';
}

export function formatActivityDate(date: Date, userName: string): string {
  const dateString = formatLastUpdate(date);
  return `${dateString} by ${userName}`;
}
