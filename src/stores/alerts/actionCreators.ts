import _ from 'lodash';
import {
  ActionTypeNames,
  Alert,
  HideAlertAction,
  ShowAlertAction,
  ShowTransientAlertAction,
  TransientAlert,
} from './actions';

export function showTransientAlert(alert: TransientAlert): ShowTransientAlertAction {
  return {
    alert: {
      id: _.uniqueId('alert_'),
      ...alert,
    },
    type: ActionTypeNames.ShowTransientAlert,
  };
}

export function showAlert(alert: Alert): ShowAlertAction {
  return {
    alert: {
      id: _.uniqueId('alert_'),
      ...alert,
    },
    type: ActionTypeNames.ShowAlert,
  };
}

export function hideAlert(id: string): HideAlertAction {
  return {
    id,
    type: ActionTypeNames.HideAlert,
  };
}
