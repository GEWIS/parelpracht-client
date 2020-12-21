import { Product, ProductParams } from '../../clients/server.generated';
import {
  ProductActionType, ProductsClearSingleAction,
  ProductsCreateSingleAction,
  ProductsErrorSingleAction,
  ProductsFetchSingleAction,
  ProductsSaveSingleAction,
  ProductsSetSingleAction,
} from './actions';

// Action creators

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
