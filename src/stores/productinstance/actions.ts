import {
  SingleCreateAction, SingleCreateCommentAction,
  SingleCreateStatusAction,
  SingleDeleteAction, SingleDeleteActivityAction,
  SingleSaveAction, SingleSaveActivityAction,
} from '../single/actions';
import { SingleEntities } from '../single/single';

type ProductInstance = {
  instanceId: number,
};

export type SingleCreateInstanceAction<RCreate> =
  SingleCreateAction<SingleEntities.ProductInstance, RCreate> & {
    id: number
  };

export type SingleSaveInstanceAction<RSave> =
  SingleSaveAction<SingleEntities.ProductInstance, RSave> & ProductInstance;

export type SingleDeleteInstanceAction =
  SingleDeleteAction<SingleEntities.ProductInstance> & ProductInstance;

export type SingleCreateInstanceStatusAction<RCreate> =
  SingleCreateStatusAction<SingleEntities.ProductInstance, RCreate> & ProductInstance;

export type SingleCreateInstanceCommentAction<RCreate> =
  SingleCreateCommentAction<SingleEntities.ProductInstance, RCreate> & ProductInstance;

export type SingleSaveInstanceActivityAction<RSave> =
  SingleSaveActivityAction<SingleEntities.ProductInstance, RSave> & ProductInstance;

export type SingleDeleteInstanceActivityAction =
  SingleDeleteActivityAction<SingleEntities.ProductInstance> & ProductInstance;
