import {
  singleActionPattern,
  SingleActionType, SingleClearAction, SingleCreateAction,
  SingleDeleteAction, SingleErrorAction, SingleFetchAction,
  SingleSaveAction,
  SingleSetAction,
} from './actions';
import { SingleEntities } from './single';

export function fetchSingle<S extends SingleEntities>(single: S, id: number): SingleFetchAction<S> {
  return { type: singleActionPattern(single, SingleActionType.Fetch), id };
}

export function setSingle<S extends SingleEntities, R>(
  single: S, data: R,
): SingleSetAction<S, R> {
  return { type: singleActionPattern(single, SingleActionType.Set), data };
}

export function saveSingle<S extends SingleEntities, RSave>(
  single: S, id: number, data: RSave,
): SingleSaveAction<S, RSave> {
  return { type: singleActionPattern(single, SingleActionType.Save), data, id };
}

export function deleteSingle<S extends SingleEntities>(
  single: S, id: number,
): SingleDeleteAction<S> {
  return { type: singleActionPattern(single, SingleActionType.Delete), id };
}

export function createSingle<S extends SingleEntities, RCreate>(
  single: S, data: RCreate,
): SingleCreateAction<S, RCreate> {
  return { type: singleActionPattern(single, SingleActionType.Create), data };
}

export function clearSingle<S extends SingleEntities>(single: S): SingleClearAction<S> {
  return { type: singleActionPattern(single, SingleActionType.Clear) };
}

export function errorSingle<S extends SingleEntities>(single: S): SingleErrorAction<S> {
  return { type: singleActionPattern(single, SingleActionType.Error) };
}
