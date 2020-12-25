import { RootState } from '../store';
import { SingleEntities } from './single';
import { SingleEntityState } from './singleState';

export function getSingle<R>(state: RootState, single: SingleEntities): SingleEntityState<R> {
  return state.single[single] as any;
}
