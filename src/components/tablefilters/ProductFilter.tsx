import { connect } from 'react-redux';
import React from 'react';
import { ProductSummary } from '../../clients/server.generated';
import ColumnFilter from '../ColumnFilter';
import { RootState } from '../../stores/store';
import { getSummaryCollection } from '../../stores/summaries/selectors';
import { SummaryCollections } from '../../stores/summaries/summaries';
import { Tables } from '../../stores/tables/tables';

interface Props {
  options: ProductSummary[]
}

function ProductFilter(props: Props) {
  return (
    <ColumnFilter
      column="productId"
      columnName="Product"
      table={Tables.ETCompanies}
      options={props.options.map((o) => ({ value: o.id, key: o.id, text: o.nameEnglish }))}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  options: getSummaryCollection<ProductSummary>(
    state, SummaryCollections.Products,
  ).options,
});

export default connect(mapStateToProps)(ProductFilter);
