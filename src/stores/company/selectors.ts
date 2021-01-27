import { Company, CompanySummary } from '../../clients/server.generated';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { ETCompany } from '../../helpers/extensiveTableObjects';

export function sortColumn(state: RootState): string {
  const column = getTable<Company>(state, Tables.Companies).sortColumn;
  switch (column) {
    case 'id': return 'ID';
    case 'name': return 'Name';
    case 'status': return 'Status';
    case 'updatedAt': return 'Last Update';
    default: return 'unknown';
  }
}

export function sortColumnMegaTable(state: RootState): string {
  const column = getTable<ETCompany>(state, Tables.ETCompanies).sortColumn;
  switch (column) {
    case 'id': return 'ID';
    case 'companyName': return 'Company';
    default: return 'unknown';
  }
}

export function getCompanyName(state: RootState, id: number): string {
  return getSummary<CompanySummary>(
    state, SummaryCollections.Companies, id,
  )?.name ?? '...';
}
