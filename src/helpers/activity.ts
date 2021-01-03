import { ActivityType, ContractStatus } from '../clients/server.generated';
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

export function formatContractStatus(status: string | undefined): string {
  switch (status) {
    case ContractStatus.CREATED: return 'Created';
    case ContractStatus.PROPOSED: return 'Proposed';
    case ContractStatus.SENT: return 'Sent';
    case ContractStatus.CONFIRMED: return 'Confirmed';
    case ContractStatus.FINISHED: return 'Finished';
    case ContractStatus.CANCELLED: return 'Cancelled';
    default: return 'Unknown';
  }
}
