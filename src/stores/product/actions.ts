import type { Action } from 'redux';
import type { Product, ProductParams } from '../../clients/server.generated';

// Action types
export enum ProductActionType {
/*   Fetch = 'Products/Fetch',
  Set = 'Products/Set',
  Clear = 'Products/Clear',
  ChangeSort = 'Products/ChangeSort',
  NextPage = 'Products/NextPage',
  PrevPage = 'Products/PrevPage',
  SetTake = 'Products/SetTake',
  Search = 'Products/Search', */

  FetchSingle = 'Products/FetchSingle',
  SetSingle = 'Products/SetSingle',
  SaveSingle = 'Products/SaveSingle',
  ErrorSingle = 'Products/ErrorSingle',
  CreateSingle = 'Products/CreateSingle',
  ClearSingle = 'Products/ClearSingle',
}

// Actions
/* export type ProductsFetchAction = Action<ProductActionType.Fetch>;

export type ProductsSetAction = Action<ProductActionType.Set> & {
  products: Product[],
  count: number,
};

export type ProductsClearAction = Action<ProductActionType.Clear>;

export type ProductsChangeSortAction = Action<ProductActionType.ChangeSort> & {
  column: string;
};

export type ProductsSetTakeAction = Action<ProductActionType.SetTake> & {
  take: number;
};

export type ProductsSearchAction = Action<ProductActionType.Search> & {
  search: string;
};

export type ProductsNextPageAction = Action<ProductActionType.NextPage>;
export type ProductsPrevPageAction = Action<ProductActionType.PrevPage>; */

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
