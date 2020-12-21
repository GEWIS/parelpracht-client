import type { Action } from 'redux';
import type { Contract, ContractParams } from '../../clients/server.generated';

// Action types
export enum ContractActionType {
  FetchSingle = 'Contracts/FetchSingle',
  SetSingle = 'Contracts/SetSingle',
  SaveSingle = 'Contracts/SaveSingle',
  ErrorSingle = 'Contracts/ErrorSingle',
  CreateSingle = 'Contracts/CreateSingle',
  ClearSingle = 'Contracts/ClearSingle',
}

// Actions

export type ContractsFetchSingleAction = Action<ContractActionType.FetchSingle> & {
  id: number,
};

export type ContractsSetSingleAction = Action<ContractActionType.SetSingle> & {
  contract: Contract,
};

export type ContractsSaveSingleAction = Action<ContractActionType.SaveSingle> & {
  id: number
  contract: ContractParams,
};

export type ContractsErrorSingleAction = Action<ContractActionType.ErrorSingle>;

export type ContractsCreateSingleAction = Action<ContractActionType.CreateSingle> & {
  contract: ContractParams,
};

export type ContractsClearSingleAction = Action<ContractActionType.ClearSingle>;
