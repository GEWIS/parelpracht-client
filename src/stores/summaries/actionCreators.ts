import {
  summariesActionPattern, SummariesActionType,
  SummariesFetchAction, SummariesSetAction,
} from './actions';
import { SummaryCollections } from './summaries';

export function fetchSummaries<S extends SummaryCollections>(
  summaries: S,
): SummariesFetchAction<S> {
  return { type: summariesActionPattern(summaries, SummariesActionType.Fetch) };
}

export function setSummaries<S extends SummaryCollections, R>(
  summaries: S, data: R[],
): SummariesSetAction<S, R> {
  return {
    type: summariesActionPattern(summaries, SummariesActionType.Set),
    data,
  };
}
