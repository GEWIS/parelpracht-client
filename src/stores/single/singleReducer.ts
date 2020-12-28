import ResourceStatus from '../resourceStatus';
import {
  SingleActions, SingleActionType, singleExtractAction, SingleSetAction,
} from './actions';
import { SingleEntities } from './single';
import { SingleEntityState } from './singleState';

const initialState = {
  data: undefined,
  status: ResourceStatus.EMPTY,
};

const createSingleReducer = <S extends SingleEntities, R, RSave, RCreate>(
  s: SingleEntities,
) => {
  return (
    state: SingleEntityState<R> = initialState,
    action: SingleActions<S, R, RSave, RCreate>,
  ): SingleEntityState<R> => {
    // Check if action is table action
    if (action.type.split('/')[0] !== 'Single') {
      return state;
    }
    const { type, singleEntity } = singleExtractAction(action.type);
    // Filter on table
    if (singleEntity !== s) {
      return state;
    }

    switch (type) {
      case SingleActionType.Fetch:
        return {
          ...state,
          status: ResourceStatus.FETCHING,
        };

      case SingleActionType.Create:
      case SingleActionType.Save:
        return {
          ...state,
          status: ResourceStatus.SAVING,
        };

      case SingleActionType.Set: {
        const a = action as SingleSetAction<S, R>;
        return {
          ...state,
          data: a.data,
          status: ResourceStatus.FETCHED,
        };
      }
      case SingleActionType.Error:
        return {
          ...state,
          status: ResourceStatus.ERROR,
        };

      case SingleActionType.Clear:
        return {
          ...state,
          data: undefined,
          status: ResourceStatus.EMPTY,
        };

      case SingleActionType.Delete:
        return {
          ...state,
          status: ResourceStatus.DELETING,
        };

      default:
        return state;
    }
  };
};

export default createSingleReducer;
