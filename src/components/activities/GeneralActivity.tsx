import { User } from '../../clients/server.generated';

export enum ActivityType {
  STATUS = 'STATUS',
  COMMENT = 'COMMENT',
}

export class GeneralActivity {
  /** Incremental ID of the entity */
  readonly id!: number;

  /** Date at which this entity has been created */
  readonly createdAt!: Date;

  /** Date at which this entity has last been updated */
  readonly updatedAt!: Date;

  /** If this entity has been soft-deleted, this is the date at which the entity has been deleted */
  readonly deletedAt?: Date;

  /** Version number of this entity */
  readonly version!: number;

  /** Type of the activity (status or comment) */
  type!: ActivityType;

  /** Description of this activity */
  description!: string;

  /** Id of the creator of the activity */
  createdById!: number;

  /** User who created this activity */
  createdBy!: User;

  /** Status of the contract/invoice/product instance */
  subType?: string;
}
