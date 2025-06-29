import type { RootState } from '../store';
import type { SingleEntities } from './single';
import type { SingleEntityState } from './singleState';

export function getSingle<R>(state: RootState, single: SingleEntities): SingleEntityState<R> {
  return state.single[single];
}
