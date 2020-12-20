import { RootState } from '../store';

export function countProducts(state: RootState): number {
  return state.product.list.length;
}
