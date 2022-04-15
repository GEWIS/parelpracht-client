import { LoginMethods } from "../../clients/server.generated";

export interface GeneralState {
  loginMethod: LoginMethods;
  financialYears: number[];
}
