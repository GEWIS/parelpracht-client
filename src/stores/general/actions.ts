import { Action } from 'redux';
import { LoginMethods } from '../../clients/server.generated';

export enum GeneralActionType {
  FetchPrivateInfo = 'General/FetchPrivateInfo',
  FetchPublicInfo = 'General/FetchPublicInfo',
  SetPrivateInfo = 'General/SetPrivateInfo',
  SetPublicInfo = 'General/SetPublicInfo',
}

export type FetchGeneralPrivateInfo = Action<GeneralActionType.FetchPrivateInfo>;
export type FetchGeneralPublicInfo = Action<GeneralActionType.FetchPublicInfo>;
export type PrivateGeneralSetInfo = Action<GeneralActionType.SetPrivateInfo> & {
  financialYears: number[];
};
export type PublicGeneralSetInfo = Action<GeneralActionType.SetPublicInfo> & {
  loginMethod: LoginMethods;
};
