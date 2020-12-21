import { Contract, ContractParams } from '../../clients/server.generated';
import {
  ContractActionType, ContractsClearSingleAction,
  ContractsCreateSingleAction,
  ContractsErrorSingleAction,
  ContractsFetchSingleAction,
  ContractsSaveSingleAction,
  ContractsSetSingleAction,
} from './actions';

// Action creators

export function fetchSingleContract(id: number): ContractsFetchSingleAction {
  return { type: ContractActionType.FetchSingle, id };
}
export function setSingleContract(contract: Contract): ContractsSetSingleAction {
  return { type: ContractActionType.SetSingle, contract };
}

export function saveSingleContract(id: number,
  contract: ContractParams): ContractsSaveSingleAction {
  return { type: ContractActionType.SaveSingle, id, contract };
}

export function errorSingleContract(): ContractsErrorSingleAction {
  return { type: ContractActionType.ErrorSingle };
}

export function createSingleContract(contract: ContractParams): ContractsCreateSingleAction {
  return { type: ContractActionType.CreateSingle, contract };
}

export function clearSingleContract(): ContractsClearSingleAction {
  return { type: ContractActionType.ClearSingle };
}
