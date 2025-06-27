import { LoginMethods } from '../../clients/server.generated';

export interface GeneralState {
  loginMethod: LoginMethods;
  setupDone: boolean;
  financialYears: number[];
}
