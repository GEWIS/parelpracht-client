import type { Action } from 'redux';
import type { Product, ProductParams } from '../../clients/server.generated';

// Action types
export enum ProductActionType {
  FetchSingle = 'Products/FetchSingle',
  SetSingle = 'Products/SetSingle',
  SaveSingle = 'Products/SaveSingle',
  ErrorSingle = 'Products/ErrorSingle',
  CreateSingle = 'Products/CreateSingle',
  ClearSingle = 'Products/ClearSingle',
}

// Actions

export type ProductsFetchSingleAction = Action<ProductActionType.FetchSingle> & {
  id: number,
};

export type ProductsSetSingleAction = Action<ProductActionType.SetSingle> & {
  product: Product,
};

export type ProductsSaveSingleAction = Action<ProductActionType.SaveSingle> & {
  id: number
  product: ProductParams,
};

export type ProductsErrorSingleAction = Action<ProductActionType.ErrorSingle>;

export type ProductsCreateSingleAction = Action<ProductActionType.CreateSingle> & {
  product: ProductParams,
};

export type ProductsClearSingleAction = Action<ProductActionType.ClearSingle>;
