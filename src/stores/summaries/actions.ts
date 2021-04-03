import { Action } from 'redux';
import { SummaryCollections } from './summaries';

export enum SummariesActionType {
  Fetch = 'Summaries/Fetch',
  Set = 'Summaries/Set',
  Update = 'Summaries/Update',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SummariesAction<A, S> = Action<string>;

export type SummariesFetchAction<S> = SummariesAction<SummariesActionType.Fetch, S>;
export type SummariesSetAction<S, R> = SummariesAction<SummariesActionType.Set, S> & {
  data: R[],
};

export type SummariesUpdateAction<S, R> = SummariesAction<SummariesActionType.Update, S> & {
  data: R,
};

export type SummariesActions<S extends SummaryCollections, R> =
  SummariesFetchAction<S> | SummariesSetAction<S, R> | SummariesUpdateAction<S, R>;

export const summariesActionPattern = <S extends SummaryCollections>(
  summaries: S, action: SummariesActionType,
): string => {
  return `${action}::${summaries}`;
};

/** Kinda disgusting */
export const summariesExtractAction = (joined: string): {
  type: SummariesActionType, summaries: SummaryCollections
} => {
  const [type, summaries] = joined.split('::');
  return {
    type: type as SummariesActionType,
    summaries: summaries as SummaryCollections,
  };
};
