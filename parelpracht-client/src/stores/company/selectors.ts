import { Company, CompanySummary, ETCompany } from '../../clients/server.generated';
import { RootState } from '../store';
import { getSummary } from '../summaries/selectors';
import { SummaryCollections } from '../summaries/summaries';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import i18n from '../../localization';

export function sortColumn(state: RootState): string {
  const column = getTable<Company>(state, Tables.Companies).sortColumn;
  switch (column) {
    case 'id':
      return i18n.t('entities.generalProps.ID');
    case 'name':
      return i18n.t('entities.company.props.name').toLowerCase();
    case 'status':
      return i18n.t('entities.generalProps.status').toLowerCase();
    case 'updatedAt':
      return i18n.t('entities.generalProps.updatedAt').toLowerCase();
    default:
      return i18n.t('entities.generalProps.unknown').toLowerCase();
  }
}

export function sortColumnMegaTable(state: RootState): string {
  const column = getTable<ETCompany>(state, Tables.ETCompanies).sortColumn;
  switch (column) {
    case 'id':
      return i18n.t('entities.generalProps.ID');
    case 'companyName':
      return i18n.t('entity.company').toLowerCase();
    default:
      return i18n.t('entities.generalProps.unknown').toLowerCase();
  }
}

export function getCompanyName(state: RootState, id: number): string {
  return getSummary<CompanySummary>(state, SummaryCollections.Companies, id)?.name ?? '...';
}

export function getCompanyLogo(state: RootState, id: number): string {
  return getSummary<CompanySummary>(state, SummaryCollections.Companies, id)?.logoFilename ?? '';
}
