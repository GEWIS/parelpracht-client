import { Action } from 'redux';

export enum ActionTypeNames {
  ShowAlert = 'Alerts/ShowAlert',
  ShowTransientAlert = 'Alerts/ShowTransientAlert',
  HideAlert = 'Alerts/HideAlert',
}

export interface Alert {
  title: string;
  type: 'error' | 'warning' | 'info' | 'success';
  message: any;
}

export interface Id {
  id: string;
}

export interface TransientAlert extends Alert {
  displayTimeInMs?: number;
}

export type ShowAlertAction = Action<ActionTypeNames.ShowAlert> & { alert: Alert & Id };
export type HideAlertAction = Action<ActionTypeNames.HideAlert> & Id;
export type ShowTransientAlertAction = Action<ActionTypeNames.ShowTransientAlert> & { alert: TransientAlert & Id };
