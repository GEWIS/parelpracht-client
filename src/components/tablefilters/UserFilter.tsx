import { connect } from 'react-redux';
import { UserSummary } from '../../clients/server.generated';
import ColumnFilter from '../ColumnFilter';
import { RootState } from '../../stores/store';
import { getSummaryCollection } from '../../stores/summaries/selectors';
import { SummaryCollections } from '../../stores/summaries/summaries';
import { Tables } from '../../stores/tables/tables';
import { formatContactName } from '../../helpers/contact';

interface Props {
  table: Tables;
  options: UserSummary[];
}

function ProductFilter(props: Props) {
  return (
    <ColumnFilter
      column="assignedToId"
      columnName="Assigned to"
      table={props.table}
      options={props.options.map((u) => ({
        value: u.id,
        key: u.id,
        text: formatContactName(u.firstName, u.lastNamePreposition, u.lastName),
      }))}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  options: getSummaryCollection<UserSummary>(state, SummaryCollections.Users).options,
});

export default connect(mapStateToProps)(ProductFilter);
