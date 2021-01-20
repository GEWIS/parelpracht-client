import { ActivityType, GeneralActivity } from '../components/activities/GeneralActivity';
import { formatLastUpdate } from './lastUpdate';
import { ContractStatus, InvoiceStatus } from '../clients/server.generated';

/**
 * Get the status type of a string
 */
export function getContractStatus(statusString: string): ContractStatus {
  switch (statusString) {
    case 'CREATED': return ContractStatus.CREATED;
    case 'PROPOSED': return ContractStatus.PROPOSED;
    case 'SENT': return ContractStatus.SENT;
    case 'CONFIRMED': return ContractStatus.CONFIRMED;
    case 'FINISHED': return ContractStatus.FINISHED;
    case 'CANCELLED': return ContractStatus.CANCELLED;
    default: return ContractStatus.CREATED;
  }
}

/**
 * Get the status type of a string
 */
export function getInvoiceStatus(statusString: string): InvoiceStatus {
  switch (statusString) {
    case 'CREATED': return InvoiceStatus.CREATED;
    case 'SENT': return InvoiceStatus.SENT;
    case 'PAID': return InvoiceStatus.PAID;
    case 'CANCELLED': return InvoiceStatus.CANCELLED;
    case 'IRRECOVERABLE': return InvoiceStatus.IRRECOVERABLE;
    default: return InvoiceStatus.CREATED;
  }
}

/**
 * Format the status of the document.
 */
export function formatDocumentStatusTitle(
  lastActivity: GeneralActivity,
  documentType: string,
): string {
  if (lastActivity.subType === 'CANCELLED') {
    return `${documentType} has been cancelled.`;
  } if (lastActivity.subType === 'IRRECOVERABLE') {
    return `${documentType} is irrecoverable.`;
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
export function getCompletedDocumentStatuses(status: string | undefined, type: string): string[] {
  if (status === undefined) {
    return [];
  }
  if (type === 'Invoice') {
    switch (status) {
      case 'CREATED':
        return ['Created'];
      case 'SENT':
        return ['Created', 'Sent'];
      case 'PAID':
        return ['Created', 'Sent', 'Paid'];
      case 'IRRECOVERABLE':
        return ['Created', 'Sent', 'Irrecoverable'];
      case 'CANCELLED':
        return ['Cancelled'];
      case 'ALL':
        return ['Created', 'Sent', 'Paid'];
      default:
        return [];
    }
  }
  switch (status) {
    case 'CREATED':
      return ['Created'];
    case 'PROPOSED':
      return ['Created', 'Proposed'];
    case 'SENT':
      return ['Created', 'Proposed', 'Sent'];
    case 'CONFIRMED':
      return ['Created', 'Proposed', 'Sent', 'Confirmed'];
    case 'FINISHED':
      return ['Created', 'Proposed', 'Sent', 'Confirmed', 'Finished'];
    case 'CANCELLED':
      return ['Cancelled'];
    case 'ALL':
      return ['Created', 'Proposed', 'Sent', 'Confirmed', 'Finished'];
    default:
      return [];
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
 * Return the status that can be completed next in array. Note that PROPOSED
 * status can be skipped, so we have an array with PROPOSED and the status after that
 */
export function getNextStatus(
  currentStatusActivity: GeneralActivity,
  documentType: string,
): string[] {
  const currentStatus = currentStatusActivity.subType;
  if (currentStatus == null) {
    return [];
  }
  // fetch all possible statuses
  const allStatuses = getCompletedDocumentStatuses('ALL', documentType);
  const result: string[] = [];
  // loop over all statuses
  for (let i = 0; i < allStatuses.length; i++) {
    // check if the status is the current status
    if (allStatuses[i].toUpperCase() === currentStatus) {
      // next item does exist
      if (typeof allStatuses[i + 1] !== 'undefined') {
        result.push(allStatuses[i + 1]);
        if (result[0].toUpperCase() === 'PROPOSED') {
          result.push(allStatuses[i + 2]);
        }
      }
      // if the next status does not exist
      return result;
    }
  }
  return result;
}

/**
 * Check if the status has applied to a document.
 * @return boolean true if status applied and false if it did not apply
 */
export function statusApplied(
  status: string,
  lastStatusActivity: GeneralActivity,
  documentType: string,
): boolean {
  if (lastStatusActivity.subType == null) {
    return false;
  }
  const completedStatuses = getCompletedDocumentStatuses(
    lastStatusActivity.subType.toUpperCase(),
    documentType,
  );
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
