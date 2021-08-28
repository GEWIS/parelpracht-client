import { Contract, ContractStatus, ContractSummary } from '../../clients/server.generated';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import i18n from '../../localization';

export function sortColumn(state: RootState): string {
  const column = getTable<Contract>(state, Tables.Contracts).sortColumn;
  switch (column) {
    case 'id': return i18n.t('entities.generalProps.ID');
    case 'title': return i18n.t('entities.contract.props.title').toLowerCase();
    case 'company': return i18n.t('entity.company').toLowerCase();
    case 'contact': return i18n.t('entity.contact').toLowerCase();
    case 'updatedAt': return i18n.t('entities.generalProps.lastUpdate').toLowerCase();
    default: return i18n.t('entities.generalProps.unknown').toLowerCase();
  }
}
export function getContractTitle(state: RootState, id: number): string {
  return getSummary<ContractSummary>(
    state, SummaryCollections.Contracts, id,
  )?.title ?? '...';
}

export function getContractStatus(state: RootState, id: number): ContractStatus {
  return getSummary<ContractSummary>(
    state, SummaryCollections.Contracts, id,
  )?.status ?? '...';
}

export function getContractValue(state: RootState, id: number): number {
  return getSummary<ContractSummary>(
    state, SummaryCollections.Contracts, id,
  )?.value ?? undefined;
}
