import {
  summariesActionPattern,
  SummariesActionType,
  SummariesAddAction,
  SummariesDeleteAction,
  SummariesFetchAction,
  SummariesSetAction,
  SummariesUpdateAction,
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

export function addSummary<S extends SummaryCollections, R>(
  summaries: S, data: R,
): SummariesAddAction<S, R> {
  return {
    type: summariesActionPattern(summaries, SummariesActionType.Add),
    data,
  };
}

export function updateSummary<S extends SummaryCollections, R>(
  summaries: S, data: R,
): SummariesUpdateAction<S, R> {
  return {
    type: summariesActionPattern(summaries, SummariesActionType.Update),
    data,
  };
}

export function deleteSummary<S extends SummaryCollections>(
  summaries: S, id: number,
): SummariesDeleteAction<S> {
  return {
    type: summariesActionPattern(summaries, SummariesActionType.Delete),
    id,
  };
}
