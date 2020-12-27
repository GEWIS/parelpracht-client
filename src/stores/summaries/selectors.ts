import type { RootState } from '../store';
import type { SummaryCollections } from './summaries';
import { SummaryBase, SummaryCollectionState } from './summariesState';

export function getSummaryCollection<R extends SummaryBase>(
  state: RootState, summaryCollection: SummaryCollections,
): SummaryCollectionState<R> {
  return state.summaries[summaryCollection] as any;
}

export function getSummary<R extends SummaryBase>(
  state: RootState, summaryCollection: SummaryCollections, id: number,
): R {
  return state.summaries[summaryCollection].lookup[id] as any as R;
}
