import { ProductInstanceStatus } from '../clients/server.generated';

export interface ETCompany {
  id: number,
  name: string,
  contracts: ETContract[],
}

export interface ETContract {
  id: number
  title: string,
  products: ETProductInstance[],
}

export interface ETProductInstance {
  id: number
  productId: number,
  comments?: string,
  basePrice: number,
  discount: number,
  createdAt: Date,
  updatedAt: Date,
  subType: ProductInstanceStatus,
}
