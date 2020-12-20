import type { Action } from 'redux';
import type { Product, ProductParams } from '../../clients/server.generated';

// Action types
export enum ProductActionType {
  Fetch = 'Products/Fetch',
  Set = 'Products/Set',
  Clear = 'Products/Clear',
  ChangeSort = 'Products/ChangeSort',

  FetchSingle = 'Products/FetchSingle',
  SetSingle = 'Products/SetSingle',
  SaveSingle = 'Products/SaveSingle',
  CreateSingle = 'Products/CreateSingle',
  ClearSingle = 'Products/SetClear',
}

// Actions
export type ProductsFetchAction = Action<ProductActionType.Fetch>;

export type ProductsSetAction = Action<ProductActionType.Set> & {
  products: Product[]
};

export type ProductsClearAction = Action<ProductActionType.Clear>;

export type ProductsChangeSortAction = Action<ProductActionType.ChangeSort> & {
  column: string;
};

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

export type ProductsCreateSingleAction = Action<ProductActionType.CreateSingle> & {
  product: ProductParams,
};

export type ProductsClearSingleAction = Action<ProductActionType.ClearSingle>;
