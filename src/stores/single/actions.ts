import type { Action } from 'redux';
import { SingleEntities } from './single';

// Action types
export enum SingleActionType {
  Fetch = 'Single/Fetch',
  Set = 'Single/Set',
  Save = 'Single/Save',
  Delete = 'Single/Delete',
  Error = 'Single/Error',
  Create = 'Single/Create',
  Clear = 'Single/Clear',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SingleAction<A, S> = Action<string>;

export type SingleFetchAction<S> = SingleAction<SingleActionType.Fetch, S> & {
  id: number,
};

export type SingleSetAction<S, R> = SingleAction<SingleActionType.Set, S> & {
  data: R,
};

export type SingleSaveAction<S, RSave> = SingleAction<SingleActionType.Save, S> & {
  id: number,
  data: RSave,
};

export type SingleDeleteAction<S> = SingleAction<SingleActionType.Delete, S> & {
  id: number,
};

export type SingleErrorAction<S> = SingleAction<SingleActionType.Error, S>;

export type SingleCreateAction<S, RCreate> = SingleAction<SingleActionType.Create, S> & {
  data: RCreate,
};

export type SingleClearAction<S> = SingleAction<SingleActionType.Clear, S>;

export type SingleActions<S extends SingleEntities, R, RSave, RCreate> =
  SingleFetchAction<S> | SingleSetAction<S, R> | SingleClearAction<S>
  | SingleErrorAction<S> | SingleSaveAction<S, RSave> | SingleCreateAction<S, RCreate>;

export const singleActionPattern = <S extends SingleEntities>(
  singleEntity: S, action: SingleActionType,
): string => {
  return `${action}::${singleEntity}`;
};

export const singleExtractAction = (joined: string): {
  type: SingleActionType, singleEntity: SingleEntities
} => {
  const [type, singleEntity] = joined.split('::');
  return {
    type: type as SingleActionType,
    singleEntity: singleEntity as SingleEntities,
  };
};
