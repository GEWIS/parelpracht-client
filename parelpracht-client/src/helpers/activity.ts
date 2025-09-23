import {
  ActivityType,
  BaseActivity,
  ContractActivity,
  ContractStatus,
  InvoiceActivity,
  InvoiceStatus,
  ProductInstanceActivity,
  ProductInstanceStatus,
} from '../clients/server.generated';
import { SingleEntities } from '../stores/single/single';
import i18n from '../localization';
import { formatLastUpdate } from './timestamp';

/**
 * Format an SingleEntity to a document string, which can be used in the activities
 */
export function formatDocumentType(entity: SingleEntities) {
  switch (entity) {
    case SingleEntities.Contract:
      return i18n.t('entity.contract');
    case SingleEntities.Invoice:
      return i18n.t('entity.invoice');
    case SingleEntities.ProductInstance:
      return i18n.t('entity.productinstance');
    case SingleEntities.Company:
      return i18n.t('entity.company');
    case SingleEntities.Product:
      return i18n.t('entity.product');
    default:
      throw new Error(`Unknown entity ${entity} to format`);
  }
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
      return i18n.t('activities.types.status.changed', {
        status: i18n.t(`entities.status.${subType?.toLowerCase()}`).toLowerCase(),
      });
    case ActivityType.EDIT:
      return i18n.t('activities.types.edit', { entity: formatDocumentType(entity).toLowerCase() });
    case ActivityType.REASSIGN:
      return i18n.t('activities.types.reassign');
    case ActivityType.ADDPRODUCT:
      return i18n.t('activities.types.addProduct', { entity: formatDocumentType(entity).toLowerCase() });
    case ActivityType.DELPRODUCT:
      return i18n.t('activities.types.delProduct', { entity: formatDocumentType(entity).toLowerCase() });
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
 * Get the status in a human readable format
 */
export function formatTranslateStatus(
  status: ContractStatus | InvoiceStatus | ProductInstanceStatus | undefined,
): string {
  if (status === undefined) {
    return i18n.t('entities.status.unknown');
  }
  if (status === ProductInstanceStatus.NOTDELIVERED) {
    return i18n.t('entities.status.notDelivered');
  }

  return i18n.t(`entities.status.${status.toLowerCase()}`);
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

export type FinancialDocumentActivity = ContractActivity | InvoiceActivity | ProductInstanceActivity;

export type DocumentStatus<T extends FinancialDocumentActivity> = Exclude<T['subType'], undefined>;

export type StatusDescriptionMap<
  T extends ContractActivity | InvoiceActivity | ProductInstanceActivity,
  R extends DocumentStatus<T> = DocumentStatus<T>,
> = Map<R, { descriptionDutch: string; descriptionEnglish: string }>;

/**
 * Get a mapping from every document status to its comments. The mapping can also be used as a list of all
 * statuses a document has.
 * @param activities
 */
export function getStatusDescriptionMap<T extends ContractActivity | InvoiceActivity | ProductInstanceActivity>(
  activities: T[],
): StatusDescriptionMap<T> {
  const s = new Map<DocumentStatus<T>, { descriptionDutch: string; descriptionEnglish: string }>();
  activities.forEach((activity) => {
    if (activity.subType) {
      s.set(activity.subType as DocumentStatus<T>, {
        descriptionDutch: activity.descriptionDutch,
        descriptionEnglish: activity.descriptionEnglish,
      });
    }
  });

  return s;
}

/**
 * Get the most recent status of a document.
 * @param statuses All statuses a document has
 * @param orderedStatuses All statuses a document can have, ordered from earliest (CREATED) to last (FINISHED)
 * @returns the most recent status of a document. Undefined if none of the given statuses are in the orderedStatuses
 * array.
 */
export function getLastDocumentStatus<
  R extends FinancialDocumentActivity,
  T extends DocumentStatus<R> = DocumentStatus<R>,
>(statuses: T[], orderedStatuses: T[]): T | undefined {
  for (const status of orderedStatuses.toReversed()) {
    if (statuses.includes(status)) return status;
  }
  return undefined;
}

/**
 * Get the most recent status of a document
 * @param activities All activities a document has
 * @param orderedStatuses All statuses a document can have, ordered from earliest (CREATED) to last (FINISHED)
 * @returns the most recent status of a document. Undefined if none of the given statuses are in the orderedStatuses
 * array.
 */
export function getLastDocumentStatusFromActivities<
  T extends ContractActivity | InvoiceActivity | ProductInstanceActivity,
>(activities: T[], orderedStatuses: DocumentStatus<T>[]): DocumentStatus<T> | undefined {
  const statusDescriptionMap = getStatusDescriptionMap(activities);
  return getLastDocumentStatus([...statusDescriptionMap.keys()], orderedStatuses);
}

/**
 * Given a list of al document's statuses, return a list of which statuses should be marked
 * as completed. This is necessary, because some statuses can be skipped (for example the
 * "Proposed" status for contracts).
 * @param statuses
 * @param getPrerequisiteStatuses
 */
export function getCompletedStatuses<
  R extends FinancialDocumentActivity,
  T extends DocumentStatus<R> = DocumentStatus<R>,
>(statuses: T[], getPrerequisiteStatuses: (s: T) => Set<T>): Set<T> {
  const set = new Set<T>();
  statuses.forEach((status) => {
    // No need to calculate the set of statuses for a status we have already processed
    if (set.has(status)) return;
    const completedStatuses = getPrerequisiteStatuses(status);
    completedStatuses.forEach((s) => {
      set.add(s);
    });
  });
  return set;
}
