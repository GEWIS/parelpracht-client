import { Product, ProductParams } from '../../clients/server.generated';
import {
  ProductActionType, ProductsChangeSortAction, ProductsClearAction, ProductsClearSingleAction,
  ProductsCreateSingleAction,
  ProductsErrorSingleAction,
  ProductsFetchAction, ProductsFetchSingleAction, ProductsNextPageAction,
  ProductsPrevPageAction, ProductsSaveSingleAction,
  ProductsSearchAction,
  ProductsSetAction, ProductsSetSingleAction, ProductsSetTakeAction,
} from './actions';

// Action creators
export function fetchProducts(): ProductsFetchAction {
  return { type: ProductActionType.Fetch };
}
export function setProducts(products: Product[], count: number): ProductsSetAction {
  return { type: ProductActionType.Set, products, count };
}

export function clearProducts(): ProductsClearAction {
  return { type: ProductActionType.Clear };
}

export function changeSortProducts(column: string): ProductsChangeSortAction {
  return { type: ProductActionType.ChangeSort, column };
}

export function setTakeProducts(take: number): ProductsSetTakeAction {
  return { type: ProductActionType.SetTake, take };
}

export function searchProducts(search: string): ProductsSearchAction {
  return { type: ProductActionType.Search, search };
}

export function nextPageProducts(): ProductsNextPageAction {
  return { type: ProductActionType.NextPage };
}

export function prevPageProducts(): ProductsPrevPageAction {
  return { type: ProductActionType.PrevPage };
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

export function errorSingleProduct(): ProductsErrorSingleAction {
  return { type: ProductActionType.ErrorSingle };
}

export function createSingleProduct(product: ProductParams): ProductsCreateSingleAction {
  return { type: ProductActionType.CreateSingle, product };
}

export function clearSingleProduct(): ProductsClearSingleAction {
  return { type: ProductActionType.ClearSingle };
}
