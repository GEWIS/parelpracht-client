import {
  SingleCreateInstanceAction, SingleCreateInstanceCommentAction,
  SingleCreateInstanceStatusAction,
  SingleDeleteInstanceAction, SingleDeleteInstanceActivityAction,
  SingleSaveInstanceAction, SingleSaveInstanceActivityAction,
} from './actions';
import { singleActionPattern, SingleActionType } from '../single/actions';
import { SingleEntities } from '../single/single';

export function createInstanceSingle<RCreate>(
  id: number, data: RCreate,
): SingleCreateInstanceAction<RCreate> {
  return {
    type: singleActionPattern(SingleEntities.ProductInstance, SingleActionType.Create),
    id,
    data,
  };
}

export function saveInstanceSingle<RSave>(
  id: number, instanceId: number, data: RSave,
): SingleSaveInstanceAction<RSave> {
  return {
    type: singleActionPattern(SingleEntities.ProductInstance, SingleActionType.Save),
    id,
    instanceId,
    data,
  };
}

export function deleteInstanceSingle(
  id: number, instanceId: number,
): SingleDeleteInstanceAction {
  return {
    type: singleActionPattern(SingleEntities.ProductInstance, SingleActionType.Delete),
    id,
    instanceId,
  };
}

export function createInstanceStatusSingle<RCreate>(
  id: number, instanceId: number, data: RCreate,
): SingleCreateInstanceStatusAction<RCreate> {
  return {
    type: singleActionPattern(SingleEntities.ProductInstance, SingleActionType.CreateStatus),
    id,
    instanceId,
    data,
  };
}

export function createInstanceCommentSingle<RCreate>(
  id: number, instanceId: number, data: RCreate,
): SingleCreateInstanceCommentAction<RCreate> {
  return {
    type: singleActionPattern(SingleEntities.ProductInstance, SingleActionType.CreateComment),
    id,
    instanceId,
    data,
  };
}

export function saveInstanceActivitySingle<RSave>(
  id: number, instanceId: number, activityId: number, data: RSave,
): SingleSaveInstanceActivityAction<RSave> {
  return {
    type: singleActionPattern(SingleEntities.ProductInstance, SingleActionType.SaveActivity),
    id,
    instanceId,
    activityId,
    data,
  };
}

export function deleteInstanceActivitySingle(
  id: number, instanceId: number, activityId: number,
): SingleDeleteInstanceActivityAction {
  return {
    type: singleActionPattern(SingleEntities.ProductInstance, SingleActionType.DeleteActivity),
    id,
    instanceId,
    activityId,
  };
}
