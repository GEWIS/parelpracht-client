import { ActivityType, GeneralActivity } from '../components/activities/GeneralActivity';
import { formatLastUpdate } from './timestamp';
import { formatLastUpdate } from './lastUpdate';
import { ContractStatus, InvoiceStatus } from '../clients/server.generated';
import { SingleEntities } from '../stores/single/single';
import { DocumentStatus } from '../components/activities/DocumentStatus';

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
  if (status === undefined) {
    return 'Unknown';
  }
  return status[0].toUpperCase() + status.slice(1).toLowerCase();
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
export function getAllDocumentStatuses(
  type: SingleEntities,
): DocumentStatus[] {
  if (type === SingleEntities.Invoice) {
    return [InvoiceStatus.CREATED,
      InvoiceStatus.SENT,
      InvoiceStatus.PAID] as any as DocumentStatus[];
  }
  return [ContractStatus.CREATED,
    ContractStatus.PROPOSED,
    ContractStatus.SENT,
    ContractStatus.CONFIRMED,
    ContractStatus.FINISHED] as any as DocumentStatus[];
}

/**
 * Get all the contract statuses that applied to a certain status.
 */
export function getCompletedDocumentStatuses(
  status: string | undefined,
  type: SingleEntities,
): DocumentStatus[] {
  if (status === undefined) {
    return [];
  }
  if (type === SingleEntities.Invoice) {
    switch (status) {
      case InvoiceStatus.CREATED:
        return [InvoiceStatus.CREATED] as any as DocumentStatus[];
      case InvoiceStatus.SENT:
        return [InvoiceStatus.CREATED,
          InvoiceStatus.SENT] as any as DocumentStatus[];
      case InvoiceStatus.PAID:
        return [InvoiceStatus.CREATED,
          InvoiceStatus.SENT,
          InvoiceStatus.PAID] as any as DocumentStatus[];
      case InvoiceStatus.IRRECOVERABLE:
        return [InvoiceStatus.CREATED,
          InvoiceStatus.SENT,
          InvoiceStatus.IRRECOVERABLE] as any as DocumentStatus[];
      case InvoiceStatus.CANCELLED:
        return [InvoiceStatus.CANCELLED] as any as DocumentStatus[];
      default:
        return [];
    }
  }
  switch (status) {
    case ContractStatus.CREATED:
      return [ContractStatus.CREATED] as any as DocumentStatus[];
    case ContractStatus.PROPOSED:
      return [ContractStatus.CREATED,
        ContractStatus.PROPOSED] as any as DocumentStatus[];
    case ContractStatus.SENT:
      return [ContractStatus.CREATED,
        ContractStatus.PROPOSED,
        ContractStatus.SENT] as any as DocumentStatus[];
    case ContractStatus.CONFIRMED:
      return [ContractStatus.CREATED,
        ContractStatus.PROPOSED,
        ContractStatus.SENT,
        ContractStatus.CONFIRMED] as any as DocumentStatus[];
    case ContractStatus.FINISHED:
      return [ContractStatus.CREATED,
        ContractStatus.PROPOSED,
        ContractStatus.SENT,
        ContractStatus.CONFIRMED,
        ContractStatus.FINISHED] as any as DocumentStatus[];
    case ContractStatus.CANCELLED:
      return [ContractStatus.CANCELLED] as any as DocumentStatus[];
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
  documentType: SingleEntities,
): string[] {
  const currentStatus = currentStatusActivity.subType;
  if (currentStatus == null) {
    return [];
  }
  // fetch all possible statuses
  const allStatuses = getAllDocumentStatuses(documentType);
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
  documentType: SingleEntities,
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
