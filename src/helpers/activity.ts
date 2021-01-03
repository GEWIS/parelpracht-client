import { ActivityType, ContractStatus } from '../clients/server.generated';
import { formatLastUpdate } from './lastUpdate';

export function formatActivityType(activityType: ActivityType): string {
  if (activityType === 'COMMENT') {
    return 'Comment';
  }
  return 'Status changed to: ';
}

export function formatActivityDate(date: Date, userName: string): string {
  const dateString = formatLastUpdate(date);
  return `${dateString} by ${userName}`;
}

export function formatStatus(status: string | undefined): string {
  switch (status) {
    case 'CREATED': return 'Created';
    case 'PROPOSED': return 'Proposed';
    case 'SENT': return 'Sent';
    case 'CONFIRMED': return 'Confirmed';
    case 'FINISHED': return 'Finished';
    case 'CANCELLED': return 'Cancelled';
    case 'PAID': return 'Paid';
    case 'IRRECOVERABLE': return 'Irrecoverable';
    default: return 'Unknown';
  }
}
