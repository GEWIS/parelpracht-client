import { LoginMethods } from '../../clients/server.generated';
import {
  FetchGeneralPrivateInfo, FetchGeneralPublicInfo, GeneralActionType,
  PrivateGeneralSetInfo, PublicGeneralSetInfo,
} from './actions';

export function generalPrivateFetchInfo(): FetchGeneralPrivateInfo {
  return { type: GeneralActionType.FetchPrivateInfo };
}

export function generalPublicFetchInfo(): FetchGeneralPublicInfo {
  return { type: GeneralActionType.FetchPublicInfo };
}

export function generalPrivateSetInfo(financialYears: number[]): PrivateGeneralSetInfo {
  return { type: GeneralActionType.SetPrivateInfo, financialYears };
}

export function generalPublicSetInfo(loginMethod: LoginMethods, setupDone: boolean): PublicGeneralSetInfo {
  return { type: GeneralActionType.SetPublicInfo, loginMethod, setupDone };
}
