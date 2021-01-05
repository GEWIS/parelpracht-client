import { ActivityType, GeneralActivity } from '../components/activities/GeneralActivity';
import { formatLastUpdate } from './lastUpdate';

/**
 * Format the status of the document.
 */
export function formatDocumentStatusTitle(cancelled: boolean, documentType: string): string {
  if (cancelled) {
    return `${documentType} has been cancelled.`;
  }
  return `${documentType} status`;
}

/**
 * Format type of the activity to a string used on the website.
 */
export function formatActivityType(activityType: ActivityType): string {
  if (activityType === 'COMMENT') {
    return 'Comment';
  }
  return 'Status changed to: ';
}

/**
 * Format the creation date and user that performed the activity.
 */
export function formatActivityDate(date: Date, userName: string): string {
  const dateString = formatLastUpdate(date);
  return `${dateString} by ${userName}`;
}

/**
 * Get the status in a string with the first character as uppercase and the rest lowercase.
 */
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

/**
 * Get all the contract statuses that applied to a certain status.
 */
export function getAllStatusActivities(activities: GeneralActivity[]): GeneralActivity[] {
  const statusActivities: GeneralActivity[] = [];
  for (let i = 0; i < activities.length; i++) {
    if (activities[i].type === ActivityType.STATUS) {
      statusActivities.push(activities[i]);
    }
  }
  return statusActivities;
}

/**
 * Get all the contract statuses that applied to a certain status.
 */
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

/**
 * Return the activity with the status update that has been last been
 * completed last. If the variable is null, then the status has not been completed yet.
 */
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

/**
 * Check if the status has applied to a document.
 * @return true if status applied and false if it did not apply
 */
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

/**
 * Get last status activity that is not the cancelling of the document
 */
export function getLastStatus(allStatusActivities: GeneralActivity[]): GeneralActivity {
  if (allStatusActivities[allStatusActivities.length - 1].subType !== 'CANCELLED') {
    return allStatusActivities[allStatusActivities.length - 1];
  }
  return allStatusActivities[allStatusActivities.length - 2];
}
