import ResourceStatus from '../resourceStatus';
import {
  SummariesActions, SummariesActionType, summariesExtractAction, SummariesSetAction,
} from './actions';
import { SummaryCollections } from './summaries';
import { SummaryBase, SummaryCollectionState } from './summariesState';

const initialState = {
  options: [],
  lookup: {},
  status: ResourceStatus.EMPTY,
  lastUpdated: new Date(),
};

const createSummariesReducer = <S extends SummaryCollections, R extends SummaryBase>(
  t: SummaryCollections) => {
  return (
    state: SummaryCollectionState<R> = initialState,
    action: SummariesActions<S, R>,
  ): SummaryCollectionState<R> => {
    // Check if action is summaries action
    if (action.type.split('/')[0] !== 'Summaries') {
      return state;
    }
    const { type, summaries } = summariesExtractAction(action.type);
    // Filter on summaries
    if (summaries !== t) {
      return state;
    }

    switch (type) {
      case SummariesActionType.Fetch:
        return {
          ...state,
          status: ResourceStatus.EMPTY,
        };
      case SummariesActionType.Set: {
        const a = action as SummariesSetAction<S, R>;
        const lookup: {[key: number]: R} = {};
        a.data.forEach((x) => { lookup[x.id] = x; });
        return {
          ...state,
          options: a.data,
          lookup,
          status: ResourceStatus.FETCHED,
          lastUpdated: new Date(),
        };
      }
      default: return state;
    }
  };
};

export default createSummariesReducer;
