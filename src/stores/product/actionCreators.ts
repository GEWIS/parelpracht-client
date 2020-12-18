import { Product } from '../../clients/server.generated';
import {
  ProductActionType, ProductsClearAction, ProductsClearSingleAction,
  ProductsFetchAction, ProductsFetchSingleAction, ProductsSetAction, ProductsSetSingleAction,
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

export function fetchSingleProduct(id: number): ProductsFetchSingleAction {
  return { type: ProductActionType.FetchSingle, id };
}
export function setSingleProduct(product: Product): ProductsSetSingleAction {
  return { type: ProductActionType.SetSingle, product };
}

export function clearSingleProduct(): ProductsClearSingleAction {
  return { type: ProductActionType.ClearSingle };
}
