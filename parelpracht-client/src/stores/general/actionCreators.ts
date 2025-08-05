import {
  FetchGeneralPrivateInfo,
  GeneralActionType,
  PrivateGeneralSetInfo,
} from './actions';

export function generalPrivateFetchInfo(): FetchGeneralPrivateInfo {
  return { type: GeneralActionType.FetchPrivateInfo };
}

export function generalPrivateSetInfo(financialYears: number[]): PrivateGeneralSetInfo {
  return { type: GeneralActionType.SetPrivateInfo, financialYears };
}
