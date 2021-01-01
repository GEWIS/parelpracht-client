import React from 'react';
import { connect } from 'react-redux';
import { CompanySummary } from '../../../clients/server.generated';
import { RootState } from '../../../stores/store';
import { getSummaryCollection } from '../../../stores/summaries/selectors';
import { SummaryCollections } from '../../../stores/summaries/summaries';
import { Tables } from '../../../stores/tables/tables';
import ColumnFilter from '../../ColumnFilter';

interface Props {
  options: CompanySummary[],
}

function ContactCompanyFilter(props: Props) {
  return (
    <ColumnFilter
      column="companyId"
      columnName="Company"
      table={Tables.Contacts}
      options={props.options.map((o) => ({ value: o.id, key: o.id, text: o.name }))}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  options: getSummaryCollection<CompanySummary>(
    state, SummaryCollections.Companies,
  ).options,
});

export default connect(mapStateToProps)(ContactCompanyFilter);
