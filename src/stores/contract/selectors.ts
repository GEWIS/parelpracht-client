import { Contract, ContractStatus, ContractSummary } from '../../clients/server.generated';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';

export function sortColumn(state: RootState): string {
  const column = getTable<Contract>(state, Tables.Contracts).sortColumn;
  switch (column) {
    case 'id': return 'ID';
    case 'title': return 'Title';
    case 'date': return 'Date';
    case 'poNumber': return 'PO Number';
    default: return 'unknown';
  }
}
export function getContract(state: RootState, id: number): string {
  return getSummary<ContractSummary>(
    state, SummaryCollections.Contracts, id,
  )?.title ?? '...';
}

export function getContractStatus(state: RootState, id: number): ContractStatus {
  return getSummary<ContractSummary>(
    state, SummaryCollections.Contracts, id,
  )?.status ?? '...';
}
