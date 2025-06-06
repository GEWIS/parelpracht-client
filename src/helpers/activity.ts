import { GeneralActivity } from '../components/activities/GeneralActivity';
import {
  ActivityType,
  BaseActivity,
  ContractStatus,
  InvoiceStatus,
  ProductInstanceStatus,
} from '../clients/server.generated';
import { SingleEntities } from '../stores/single/single';
import { DocumentStatus } from '../components/activities/DocumentStatus';
import i18n from '../localization';
import { formatLastUpdate } from './timestamp';

/**
 * Format an SingleEntity to a document string, which can be used in the activities
 */
export function formatDocumentType(entity: SingleEntities) {
  switch (entity) {
    case SingleEntities.Contract: return i18n.t('entity.contract');
    case SingleEntities.Invoice: return i18n.t('entity.invoice');
    case SingleEntities.ProductInstance: return i18n.t('entity.productinstance');
    case SingleEntities.Company: return i18n.t('entity.company');
    case SingleEntities.Product: return i18n.t('entity.product');
    default: throw new Error(`Unknown entity ${entity} to format`);
  }
}

/**
 * Format the status of the document.
 */
export function formatDocumentStatusTitle(
  lastActivity: GeneralActivity,
  documentType: SingleEntities,
): string {
  const entity = formatDocumentType(documentType);
  if (lastActivity == null) {
    return i18n.t('activities.status.header.general', { entity });
  }
  if (lastActivity.subType === 'CANCELLED') {
    return i18n.t('activities.status.header.cancelled', { entity });
  } if (lastActivity.subType === 'IRRECOVERABLE') {
    return i18n.t('activities.status.header.irrecoverable', { entity });
  }
  return i18n.t('activities.status.header.general', { entity });
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
      return i18n.t('activities.types.comment');
    case ActivityType.STATUS:
      if (subType?.toLowerCase() === 'created') {
        return i18n.t('activities.types.status.created', { entity: formatDocumentType(entity) });
      }
      if (subType?.toLowerCase() === 'notdelivered') {
        return i18n.t('activities.types.status.added', { entity: formatDocumentType(entity) });
      }
      return i18n.t('activities.types.status.changed', { status: i18n.t(`entities.status.${subType?.toLowerCase()}`).toLowerCase() });
    case ActivityType.EDIT:
      return i18n.t('activities.types.edit', { entity: formatDocumentType(entity).toLowerCase() });
    case ActivityType.REASSIGN:
      return i18n.t('activities.types.reassign');
    case ActivityType.ADDPRODUCT:
      return i18n.t('activities.types.addProduct', { entity: formatDocumentType(entity).toLowerCase() });
    case ActivityType.DELPRODUCT:
      return i18n.t('activities.types.delProduct', { entity: formatDocumentType(entity).toLowerCase() });
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
  return `${dateString} ${i18n.t('other.dateTime.by')} ${userName}`;
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
  return `${activity} ${i18n.t('other.dateTime.by')} `;
}

/**
 * Get the status in a string with the first character as uppercase and the rest lowercase.
 */
export function formatStatus(status: string | undefined): string {
  if (status === undefined) {
    return i18n.t('entities.status.unknown');
  }
  if (status === ProductInstanceStatus.NOTDELIVERED) {
    return i18n.t('entities.status.notDelivered');
  }

  return i18n.t(`entities.status.${status.toLowerCase()}`);
}

/**
 * Get all the contract/invoice activities that set a status.
 */
export function getAllStatusActivities(activities: GeneralActivity[]): GeneralActivity[] {
  const statusActivities: GeneralActivity[] = [];
  for (let i = 0; i < activities.length; i++) {
    if (activities[i].type === ActivityType.STATUS) {
      statusActivities.push(activities[i]);
    }
  }
  statusActivities.sort((a, b) => { return a.createdAt.getTime() - b.createdAt.getTime(); });
  return statusActivities;
}

/**
 * Get all the statuses from a list of status activities
 */
export function getStatusesFromActivities(activities: GeneralActivity[]): DocumentStatus[] {
  activities.sort((a, b) => { return a.createdAt.getTime() - b.createdAt.getTime(); });
  const statuses: DocumentStatus[] = [];
  for (let i = 0; i < activities.length; i++) {
    statuses.push(activities[i].subType as DocumentStatus);
  }
  return statuses;
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
        InvoiceStatus.PROPOSED,
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
  status: DocumentStatus,
  type: SingleEntities,
): DocumentStatus[] {
  if (status === undefined) {
    return [];
  }
  if (type === SingleEntities.Invoice) {
    switch (status) {
      case DocumentStatus.CREATED:
        return [DocumentStatus.CREATED] as any as DocumentStatus[];
      case DocumentStatus.PROPOSED:
        return [DocumentStatus.CREATED,
          DocumentStatus.PROPOSED] as any as DocumentStatus[];
      case DocumentStatus.SENT:
        return [DocumentStatus.CREATED,
          DocumentStatus.PROPOSED,
          DocumentStatus.SENT] as any as DocumentStatus[];
      case DocumentStatus.PAID:
        return [DocumentStatus.CREATED,
          DocumentStatus.PROPOSED,
          DocumentStatus.SENT,
          DocumentStatus.PAID] as any as DocumentStatus[];
      case DocumentStatus.IRRECOVERABLE:
        return [DocumentStatus.CREATED,
          DocumentStatus.PROPOSED,
          DocumentStatus.SENT,
          DocumentStatus.IRRECOVERABLE] as any as DocumentStatus[];
      case DocumentStatus.CANCELLED:
        return [DocumentStatus.CANCELLED] as any as DocumentStatus[];
      default:
        return [];
    }
  }
  if (type === SingleEntities.Contract) {
    switch (status) {
      case DocumentStatus.CREATED:
        return [DocumentStatus.CREATED] as any as DocumentStatus[];
      case DocumentStatus.PROPOSED:
        return [DocumentStatus.CREATED,
          DocumentStatus.PROPOSED] as any as DocumentStatus[];
      case DocumentStatus.SENT:
        return [DocumentStatus.CREATED,
          DocumentStatus.PROPOSED,
          DocumentStatus.SENT] as any as DocumentStatus[];
      case DocumentStatus.CONFIRMED:
        return [DocumentStatus.CREATED,
          DocumentStatus.PROPOSED,
          DocumentStatus.SENT,
          DocumentStatus.CONFIRMED] as any as DocumentStatus[];
      case DocumentStatus.FINISHED:
        return [DocumentStatus.CREATED,
          DocumentStatus.PROPOSED,
          DocumentStatus.SENT,
          DocumentStatus.CONFIRMED,
          DocumentStatus.FINISHED] as any as DocumentStatus[];
      case DocumentStatus.CANCELLED:
        return [DocumentStatus.CANCELLED] as any as DocumentStatus[];
      default:
        return [];
    }
  }
  if (type === SingleEntities.ProductInstance) {
    switch (status) {
      case DocumentStatus.NOTDELIVERED:
        return [DocumentStatus.NOTDELIVERED] as any as DocumentStatus[];
      case DocumentStatus.DELIVERED:
        return [DocumentStatus.NOTDELIVERED,
          DocumentStatus.DELIVERED] as any as DocumentStatus[];
      case DocumentStatus.CANCELLED:
        return [DocumentStatus.NOTDELIVERED,
          DocumentStatus.CANCELLED] as any as DocumentStatus[];
      case DocumentStatus.DEFERRED:
        return [DocumentStatus.NOTDELIVERED,
          DocumentStatus.DEFERRED] as any as DocumentStatus[];
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
): GeneralActivity | undefined {
  for (let i = 0; i < activities.length; i++) {
    if (activities[activities.length - i - 1].subType === status.toUpperCase()) {
      return activities[activities.length - i - 1];
    }
  }
  return undefined;
}

/**
 * Return the status that can be completed next in array. Note that PROPOSED
 * status can be skipped, so we have an array with PROPOSED and the status after that
 */
export function getToDoStatus(
  currentStatus: DocumentStatus,
  documentType: SingleEntities,
): DocumentStatus[] {
  // fetch all possible statuses
  const allStatuses = getAllDocumentStatuses(documentType);
  const result: DocumentStatus[] = [];
  // loop over all statuses
  for (let i = 0; i < allStatuses.length; i++) {
    // check if the status is the current status
    if (allStatuses[i] === currentStatus) {
      // if the next item does exist
      if (typeof allStatuses[i + 1] !== 'undefined') {
        result.push(allStatuses[i + 1]);
        if (result[0] === DocumentStatus.PROPOSED) {
          result.push(allStatuses[i + 2]);
        }
      }
      // if the next status does not exist
      return result;
    }
  }
  return result;
}

// /**
//  * Check if the status has applied to a document.
//  * @return boolean true if status applied and false if it did not apply
//  */
// export function statusApplied(
//   status: string,
//   lastStatusActivity: GeneralActivity | undefined,
//   documentType: SingleEntities,
// ): boolean {
//   if (lastStatusActivity == null || lastStatusActivity.subType == null) {
//     return false;
//   }
//   const completedStatuses = getCompletedDocumentStatuses(
//     lastStatusActivity.subType.toUpperCase(),
//     documentType,
//   );
//   for (let i = 0; i < completedStatuses.length; i++) {
//     if (completedStatuses[i].toUpperCase() === status.toUpperCase()) {
//       return true;
//     }
//   }
//   return false;
// }

/**
 * Get last status activity that is not the cancelling of the document
 */
export function getLastStatusNotCancelled(
  allStatuses: DocumentStatus[],
): DocumentStatus {
  if (allStatuses[allStatuses.length - 1] !== DocumentStatus.CANCELLED) {
    return allStatuses[allStatuses.length - 1];
  }
  return allStatuses[allStatuses.length - 2];
}

/**
 * Get the last status activity
 * @param activities All activities
 */
export function getLastStatus<T extends BaseActivity>(activities: T[]): T | undefined {
  const filtered = activities.filter((a) => a.type === ActivityType.STATUS);
  if (filtered.length > 0) {
    return filtered[filtered.length - 1];
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
