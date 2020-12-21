import ResourceStatus from '../resourceStatus';
import * as actionCreators from './actionCreators';
import { CompanyActionType } from './actions';
import { CompanyState } from './state';

const initialState: CompanyState = {
  list: [],
  listCount: 0,
  listStatus: ResourceStatus.EMPTY,

  listSortColumn: 'id',
  listSortDirection: 'ASC',
  listLastUpdated: new Date(),
  listSkip: 0,
  listTake: 10,
  listSearch: '',

  single: undefined,
  singleStatus: ResourceStatus.EMPTY,
};

type CompanyAction = ReturnType<typeof actionCreators[keyof typeof actionCreators]>;

export default function companyReducer(
  state: CompanyState = initialState, action: CompanyAction,
): CompanyState {
  switch (action.type) {
    case CompanyActionType.Fetch:
      return {
        ...state,
        listStatus: ResourceStatus.FETCHING,
      };

    case CompanyActionType.Set:
      return {
        ...state,
        list: action.companies,
        listCount: action.count,
        listStatus: ResourceStatus.FETCHED,
        listLastUpdated: new Date(),
      };

    case CompanyActionType.Clear:
      return {
        ...state,
        list: [],
        listSkip: 0,
        listStatus: ResourceStatus.EMPTY,
      };

    case CompanyActionType.SetTake:
      return {
        ...state,
        listSkip: 0,
        listTake: action.take,
      };

    case CompanyActionType.Search:
      return {
        ...state,
        listSkip: 0,
        listSearch: action.search,
      };

    case CompanyActionType.NextPage:
      if (state.listSkip + state.listTake < state.listCount) {
        return {
          ...state,
          listSkip: state.listSkip + state.listTake,
        };
      }
      return state;

    case CompanyActionType.PrevPage:
      if (state.listSkip > 0) {
        return {
          ...state,
          listSkip: Math.max(state.listSkip - state.listTake, 0),
        };
      }
      return state;

    case CompanyActionType.ChangeSort:
      if (state.listSortColumn === action.column) {
        if (state.listSortDirection === 'DESC') {
          return {
            ...state,
            listSkip: 0,
            listSortColumn: 'id',
            listSortDirection: 'ASC',
          };
        }

        return {
          ...state,
          listSkip: 0,
          listSortDirection: 'DESC',
        };
      }

      return {
        ...state,
        listSkip: 0,
        listSortColumn: action.column,
        listSortDirection: 'ASC',
      };

    case CompanyActionType.FetchSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.FETCHING,
      };

    case CompanyActionType.CreateSingle:
    case CompanyActionType.SaveSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.SAVING,
      };

    case CompanyActionType.SetSingle:
      return {
        ...state,
        single: action.company,
        singleStatus: ResourceStatus.FETCHED,
      };

    case CompanyActionType.ErrorSingle:
      return {
        ...state,
        singleStatus: ResourceStatus.ERROR,
      };

    case CompanyActionType.ClearSingle:
      return {
        ...state,
        single: undefined,
        singleStatus: ResourceStatus.EMPTY,
      };

    default:
      return state;
  }
}
