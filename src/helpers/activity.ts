import { ActivityType, GeneralActivity } from '../components/activities/GeneralActivity';
import { formatLastUpdate } from './lastUpdate';

export function formatDocumentStatusTitle(cancelled: boolean, documentType: string): string {
  if (cancelled) {
    return `${documentType} has been cancelled.`;
  }
  return `${documentType} status`;
}

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

export function getAllStatusActivities(activities: GeneralActivity[]): GeneralActivity[] {
  const statusActivities: GeneralActivity[] = [];
  for (let i = 0; i < activities.length; i++) {
    if (activities[i].type === ActivityType.STATUS) {
      statusActivities.push(activities[i]);
    }
  }
  return statusActivities;
}

export function getCompletedContractStatuses(status: string): string[] {
  switch (status) {
    case 'CREATED': return ['Created'];
    case 'PROPOSED': return ['Created', 'Proposed'];
    case 'SENT': return ['Created', 'Proposed', 'Sent'];
    case 'CONFIRMED': return ['Created', 'Proposed', 'Sent', 'Confirmed'];
    case 'FINISHED': return ['Created', 'Proposed', 'Sent', 'Confirmed', 'Finished'];
    case 'CANCELLED': return ['Cancelled'];
    case 'ALL': return ['Created', 'Proposed', 'Sent', 'Confirmed', 'Finished'];
    default: return [];
  }
}

export function getStatusActivity(
  activities: GeneralActivity[],
  status: string,
): GeneralActivity | null {
  for (let i = 0; i < activities.length; i++) {
    if (activities[activities.length - i - 1].subType === status.toUpperCase()) {
      return activities[activities.length - i - 1];
    }
  }
  return null;
}

export function statusApplied(
  status: string,
  lastStatusActivity: GeneralActivity,
): boolean {
  if (lastStatusActivity.subType == null) {
    return false;
  }
  const completedStatuses = getCompletedContractStatuses(lastStatusActivity.subType.toUpperCase());
  for (let i = 0; i < completedStatuses.length; i++) {
    if (completedStatuses[i].toUpperCase() === status.toUpperCase()) {
      return true;
    }
  }
  return false;
}

export function getLastStatus(allStatusActivities: GeneralActivity[]): GeneralActivity {
  if (allStatusActivities[allStatusActivities.length - 1].subType !== 'CANCELLED') {
    return allStatusActivities[allStatusActivities.length - 1];
  }
  return allStatusActivities[allStatusActivities.length - 2];
}
