import { connect } from 'react-redux';
import { CategorySummary } from '../../clients/server.generated';
import ColumnFilter from '../ColumnFilter';
import { RootState } from '../../stores/store';
import { getSummaryCollection } from '../../stores/summaries/selectors';
import { SummaryCollections } from '../../stores/summaries/summaries';
import { Tables } from '../../stores/tables/tables';

interface Props {
  options: CategorySummary[];
}

function ProductCategoryFilter(props: Props) {
  return (
    <ColumnFilter
      column="categoryId"
      columnName="Category"
      table={Tables.Products}
      options={props.options.map((o) => ({ value: o.id, key: o.id, text: o.name }))}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  options: getSummaryCollection<CategorySummary>(state, SummaryCollections.ProductCategories).options,
});

export default connect(mapStateToProps)(ProductCategoryFilter);
