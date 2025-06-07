import {
  singleActionPattern,
  SingleActionType,
  SingleClearAction,
  SingleCreateAction,
  SingleCreateCommentAction,
  SingleCreateStatusAction,
  SingleDeleteAction,
  SingleDeleteActivityAction,
  SingleDeleteFileAction,
  SingleErrorAction,
  SingleFetchAction,
  SingleNotFoundAction,
  SingleSaveAction,
  SingleSaveActivityAction,
  SingleSaveFileAction,
  SingleSetAction,
} from './actions';
import { SingleEntities } from './single';

export function fetchSingle<S extends SingleEntities>(single: S, id: number): SingleFetchAction<S> {
  return { type: singleActionPattern(single, SingleActionType.Fetch), id };
}

export function setSingle<S extends SingleEntities, R>(single: S, data: R): SingleSetAction<S, R> {
  return { type: singleActionPattern(single, SingleActionType.Set), data };
}

export function saveSingle<S extends SingleEntities, RSave>(
  single: S,
  id: number,
  data: RSave,
): SingleSaveAction<S, RSave> {
  return { type: singleActionPattern(single, SingleActionType.Save), data, id };
}

export function saveSingleFile<S extends SingleEntities, RSave>(
  single: S,
  id: number,
  fileId: number,
  data: RSave,
): SingleSaveFileAction<S, RSave> {
  return {
    type: singleActionPattern(single, SingleActionType.SaveFile),
    data,
    id,
    fileId,
  };
}

export function deleteSingle<S extends SingleEntities>(single: S, id: number): SingleDeleteAction<S> {
  return { type: singleActionPattern(single, SingleActionType.Delete), id };
}

export function deleteFileSingle<S extends SingleEntities>(
  single: S,
  id: number,
  fileId: number,
): SingleDeleteFileAction<S> {
  return { type: singleActionPattern(single, SingleActionType.DeleteFile), id, fileId };
}

export function createSingle<S extends SingleEntities, RCreate>(
  single: S,
  data: RCreate,
): SingleCreateAction<S, RCreate> {
  return { type: singleActionPattern(single, SingleActionType.Create), data };
}

export function createSingleStatus<S extends SingleEntities, RSave>(
  single: S,
  id: number,
  data: RSave,
): SingleCreateStatusAction<S, RSave> {
  return {
    type: singleActionPattern(single, SingleActionType.CreateStatus),
    id,
    data,
  };
}

export function createSingleComment<S extends SingleEntities, RSave>(
  single: S,
  id: number,
  data: RSave,
): SingleCreateCommentAction<S, RSave> {
  return {
    type: singleActionPattern(single, SingleActionType.CreateComment),
    id,
    data,
  };
}

export function saveSingleActivity<S extends SingleEntities, RSave>(
  single: S,
  id: number,
  activityId: number,
  data: RSave,
): SingleSaveActivityAction<S, RSave> {
  return {
    type: singleActionPattern(single, SingleActionType.SaveActivity),
    data,
    id,
    activityId,
  };
}

export function deleteActivitySingle<S extends SingleEntities>(
  single: S,
  id: number,
  activityId: number,
): SingleDeleteActivityAction<S> {
  return { type: singleActionPattern(single, SingleActionType.DeleteActivity), id, activityId };
}

export function clearSingle<S extends SingleEntities>(single: S): SingleClearAction<S> {
  return { type: singleActionPattern(single, SingleActionType.Clear) };
}

export function errorSingle<S extends SingleEntities>(single: S): SingleErrorAction<S> {
  return { type: singleActionPattern(single, SingleActionType.Error) };
}

export function notFoundSingle<S extends SingleEntities>(single: S): SingleNotFoundAction<S> {
  return { type: singleActionPattern(single, SingleActionType.NotFound) };
}
