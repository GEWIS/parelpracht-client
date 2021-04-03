import { GeneralActivity } from '../components/activities/GeneralActivity';
import { formatLastUpdate } from './timestamp';
import {
  ActivityType, ContractStatus, InvoiceStatus, ProductInstanceStatus,
} from '../clients/server.generated';
import { SingleEntities } from '../stores/single/single';
import { DocumentStatus } from '../components/activities/DocumentStatus';

/**
 * Format an SingleEntity to a document string, which can be used in the activities
 */
export function formatDocumentType(entity: SingleEntities) {
  switch (entity) {
    case SingleEntities.Contract: return 'Contract';
    case SingleEntities.Invoice: return 'Invoice';
    case SingleEntities.ProductInstance: return 'Product';
    case SingleEntities.Company: return 'Company';
    case SingleEntities.Product: return 'Product';
    default: throw new Error(`Unknown entity ${entity} to format`);
  }
}

/**
 * Format the status of the document.
 */
export function formatDocumentStatusTitle(
  lastActivity: GeneralActivity,
  documentType: string,
): string {
  if (lastActivity == null) {
    return `${documentType} status`;
  }
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
export function formatActivityType(
  activityType: ActivityType,
  subType: string | undefined,
  entity: SingleEntities,
): string {
  switch (activityType) {
    case ActivityType.COMMENT:
      return 'Comment added';
    case ActivityType.STATUS:
      return `Status changed to ${subType?.toLowerCase()}`;
    case ActivityType.EDIT:
      return `${formatDocumentType(entity)} updated`;
    case ActivityType.REASSIGN:
      return 'Assignment changed';
    case ActivityType.ADDPRODUCT:
      return `Products added to ${formatDocumentType(entity)}`;
    case ActivityType.DELPRODUCT:
      return `Product removed from ${formatDocumentType(entity)}`;
    default:
      throw new Error(`Unknown activity type ${activityType}`);
  }
}

/**
 * Format the creation date and user that performed the activity.
 * @param date date of the activity
 * @param userName of the user who performed the activity
 */
export function formatActivityDate(date: Date, userName: string): string {
  const dateString = formatLastUpdate(date);
  return `${dateString} by ${userName}`;
}

/**
 * Format the summary user and activity for the feed.
 */
export function formatActivitySummary(
  activityType: ActivityType,
  subType: string | undefined,
  entity: SingleEntities,
): string {
  const activity = formatActivityType(activityType, subType, entity);
  return `${activity} by `;
}

/**
 * Get the status in a string with the first character as uppercase and the rest lowercase.
 */
export function formatStatus(status: string | undefined): string {
  if (status === undefined) {
    return 'Unknown';
  }
  if (status === ProductInstanceStatus.NOTDELIVERED) {
    return 'Not delivered';
  }
  return status.substring(0, 1).toUpperCase() + status.slice(1).toLowerCase();
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
  switch (type) {
    case SingleEntities.Invoice:
      return [InvoiceStatus.CREATED,
        InvoiceStatus.SENT,
        InvoiceStatus.PAID] as any as DocumentStatus[];
    case SingleEntities.Contract:
      return [ContractStatus.CREATED,
        ContractStatus.PROPOSED,
        ContractStatus.SENT,
        ContractStatus.CONFIRMED,
        ContractStatus.FINISHED] as any as DocumentStatus[];
    case SingleEntities.ProductInstance:
      return [ProductInstanceStatus.NOTDELIVERED,
        ProductInstanceStatus.DELIVERED] as any as DocumentStatus[];
    default:
      throw new Error(`Unknown document status type ${type}`);
  }
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
  if (type === SingleEntities.Contract) {
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
  if (type === SingleEntities.ProductInstance) {
    switch (status) {
      case ProductInstanceStatus.NOTDELIVERED:
        return [ProductInstanceStatus.NOTDELIVERED] as any as DocumentStatus[];
      case ProductInstanceStatus.DELIVERED:
        return [ProductInstanceStatus.NOTDELIVERED,
          ProductInstanceStatus.DELIVERED] as any as DocumentStatus[];
      case ProductInstanceStatus.CANCELLED:
        return [ProductInstanceStatus.NOTDELIVERED,
          ProductInstanceStatus.CANCELLED] as any as DocumentStatus[];
      case ProductInstanceStatus.DEFERRED:
        return [ProductInstanceStatus.NOTDELIVERED,
          ProductInstanceStatus.DEFERRED] as any as DocumentStatus[];
      default:
        return [];
    }
  }
  return [];
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
  lastStatusActivity: GeneralActivity | undefined,
  documentType: SingleEntities,
): boolean {
  if (lastStatusActivity == null || lastStatusActivity.subType == null) {
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
export function getLastStatusNotCancelled(
  allStatusActivities: GeneralActivity[],
): GeneralActivity | undefined {
  if (allStatusActivities.length > 0) {
    if (allStatusActivities[allStatusActivities.length - 1].subType !== 'CANCELLED') {
      return allStatusActivities[allStatusActivities.length - 1];
    }
    return allStatusActivities[allStatusActivities.length - 2];
  }
  return undefined;
}

/**
 * Get the last status activity
 * @param allStatusActivities All activities where type=STATUS
 */
export function getLastStatus(allStatusActivities: GeneralActivity[]): GeneralActivity | undefined {
  if (allStatusActivities.length > 0) {
    return allStatusActivities[allStatusActivities.length - 1];
  }
  return undefined;
}

/**
 * Get the initials of a user for the feed label
 * @param userName name of the creator of the activity
 */
export function formatUserNameInitials(userName: string): string {
  const splitName = userName.split(' ');
  return `${splitName[0][0] + splitName[splitName.length - 1][0]}`;
}
