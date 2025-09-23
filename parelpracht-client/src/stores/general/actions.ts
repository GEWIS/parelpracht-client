import { Action } from 'redux';

export enum GeneralActionType {
  FetchPrivateInfo = 'General/FetchPrivateInfo',
  SetPrivateInfo = 'General/SetPrivateInfo',
}

export type FetchGeneralPrivateInfo = Action<GeneralActionType.FetchPrivateInfo>;
export type PrivateGeneralSetInfo = Action<GeneralActionType.SetPrivateInfo> & {
  financialYears: number[];
};
