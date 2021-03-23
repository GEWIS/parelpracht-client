import { GeneralActionType, GeneralFetchInfo, GeneralSetInfo } from './actions';

export function generalFetchInfo(): GeneralFetchInfo {
  return { type: GeneralActionType.FetchInfo };
}

export function generalSetInfo(financialYears: number[]): GeneralSetInfo {
  return { type: GeneralActionType.SetInfo, financialYears };
}
