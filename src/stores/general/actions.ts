import { Action } from 'redux';

export enum GeneralActionType {
  FetchInfo = 'General/FetchInfo',
  SetInfo = 'General/SetInfo',
}

export type GeneralFetchInfo = Action<GeneralActionType.FetchInfo>;
export type GeneralSetInfo = Action<GeneralActionType.SetInfo> & {
  financialYears: number[];
};
