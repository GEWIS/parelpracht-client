import type { Action } from 'redux';
import { SingleEntities } from './single';

// Action types
export enum SingleActionType {
  Fetch = 'Single/Fetch',
  Set = 'Single/Set',
  Save = 'Single/Save',
  Delete = 'Single/Delete',
  Error = 'Single/Error',
  NotFound = 'Single/NotFound',
  Create = 'Single/Create',
  Clear = 'Single/Clear',
  SaveFile = 'Single/SaveFile',
  DeleteFile = 'Single/DeleteFile',
  CreateStatus = 'Single/CreateStatus',
  CreateComment = 'Single/CreateComment',
  SaveActivity = 'Single/SaveActivity',
  DeleteActivity = 'Single/DeleteActivity',
}

type SingleAction<A, S> = Action<string>;

export type SingleFetchAction<S> = SingleAction<SingleActionType.Fetch, S> & {
  id: number;
};

export type SingleSetAction<S, R> = SingleAction<SingleActionType.Set, S> & {
  data: R;
};

export type SingleSaveAction<S, RSave> = SingleAction<SingleActionType.Save, S> & {
  id: number;
  data: RSave;
};

export type SingleSaveFileAction<S, RSave> = SingleAction<SingleActionType.SaveFile, S> & {
  id: number;
  fileId: number;
  data: RSave;
};

export type SingleDeleteAction<S> = SingleAction<SingleActionType.Delete, S> & {
  id: number;
};

export type SingleDeleteFileAction<S> = SingleAction<SingleActionType.DeleteFile, S> & {
  id: number;
  fileId: number;
};

export type SingleErrorAction<S> = SingleAction<SingleActionType.Error, S>;

export type SingleNotFoundAction<S> = SingleAction<SingleActionType.NotFound, S>;

export type SingleCreateAction<S, RCreate> = SingleAction<SingleActionType.Create, S> & {
  data: RCreate;
};

export type SingleClearAction<S> = SingleAction<SingleActionType.Clear, S>;

export type SingleCreateStatusAction<S, RCreate> = SingleAction<SingleActionType.CreateStatus, S> & {
  id: number;
  data: RCreate;
};

export type SingleCreateCommentAction<S, RCreate> = SingleAction<SingleActionType.CreateComment, S> & {
  id: number;
  data: RCreate;
};

export type SingleSaveActivityAction<S, RSave> = SingleAction<SingleActionType.SaveActivity, S> & {
  id: number;
  activityId: number;
  data: RSave;
};

export type SingleDeleteActivityAction<S> = SingleAction<SingleActionType.DeleteActivity, S> & {
  id: number;
  activityId: number;
};

export type SingleActions<S extends SingleEntities, R, RSave, RCreate> =
  | SingleFetchAction<S>
  | SingleSetAction<S, R>
  | SingleClearAction<S>
  | SingleSaveAction<S, RSave>
  | SingleCreateAction<S, RCreate>;

export const singleActionPattern = <S extends SingleEntities>(singleEntity: S, action: SingleActionType): string => {
  return `${action}::${singleEntity}`;
};

export const singleExtractAction = (
  joined: string,
): {
  type: SingleActionType;
  singleEntity: SingleEntities;
} => {
  const [type, singleEntity] = joined.split('::');
  return {
    type: type as SingleActionType,
    singleEntity: singleEntity as SingleEntities,
  };
};
