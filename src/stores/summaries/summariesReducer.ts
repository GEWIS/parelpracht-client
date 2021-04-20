import ResourceStatus from '../resourceStatus';
import {
  SummariesActions,
  SummariesActionType,
  SummariesAddAction, SummariesDeleteAction,
  summariesExtractAction,
  SummariesSetAction,
  SummariesUpdateAction,
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
        const lookup: { [key: number]: R } = {};
        a.data.forEach((x) => { lookup[x.id] = x; });
        return {
          ...state,
          options: a.data,
          lookup,
          status: ResourceStatus.FETCHED,
          lastUpdated: new Date(),
        };
      }
      case SummariesActionType.Add: {
        const a = action as SummariesAddAction<S, R>;
        const { lookup, options } = state;
        lookup[a.data.id] = a.data;
        options.push(a.data);
        return {
          ...state,
          options,
          lookup,
          lastUpdated: new Date(),
        };
      }
      case SummariesActionType.Update: {
        const a = action as SummariesUpdateAction<S, R>;
        const { lookup, options } = state;
        const index = options.findIndex((x) => x.id === a.data.id);
        if (index >= 0) options[index] = a.data;
        lookup[a.data.id] = a.data;
        return {
          ...state,
          options,
          lookup,
          lastUpdated: new Date(),
        };
      }
      case SummariesActionType.Delete: {
        const a = action as SummariesDeleteAction<S>;
        const { lookup, options } = state;
        const index = options.findIndex((x) => x.id === a.id);
        if (index >= 0) options.splice(index, 1);
        delete lookup[a.id];
        return {
          ...state,
          options,
          lookup,
          lastUpdated: new Date(),
        };
      }
      default: return state;
    }
  };
};

export default createSummariesReducer;
