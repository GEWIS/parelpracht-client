import { Product, ProductParams } from '../../clients/server.generated';
import {
  ProductActionType, ProductsChangeSortAction, ProductsClearAction, ProductsClearSingleAction,
  ProductsCreateSingleAction,
  ProductsFetchAction, ProductsFetchSingleAction, ProductsSaveSingleAction,
  ProductsSetAction, ProductsSetSingleAction,
} from './actions';

// Action creators
export function fetchProducts(): ProductsFetchAction {
  return { type: ProductActionType.Fetch };
}
export function setProducts(products: Product[]): ProductsSetAction {
  return { type: ProductActionType.Set, products };
}

export function clearProducts(): ProductsClearAction {
  return { type: ProductActionType.Clear };
}

export function changeSortProducts(column: string): ProductsChangeSortAction {
  return { type: ProductActionType.ChangeSort, column };
}

export function fetchSingleProduct(id: number): ProductsFetchSingleAction {
  return { type: ProductActionType.FetchSingle, id };
}
export function setSingleProduct(product: Product): ProductsSetSingleAction {
  return { type: ProductActionType.SetSingle, product };
}

export function saveSingleProduct(id: number, product: ProductParams): ProductsSaveSingleAction {
  return { type: ProductActionType.SaveSingle, id, product };
}

export function createSingleProduct(product: ProductParams): ProductsCreateSingleAction {
  return { type: ProductActionType.CreateSingle, product };
}

export function clearSingleProduct(): ProductsClearSingleAction {
  return { type: ProductActionType.ClearSingle };
}
