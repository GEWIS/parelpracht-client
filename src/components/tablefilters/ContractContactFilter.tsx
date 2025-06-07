import { connect } from 'react-redux';
import { ContactSummary } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { getSummaryCollection } from '../../stores/summaries/selectors';
import { SummaryCollections } from '../../stores/summaries/summaries';
import { Tables } from '../../stores/tables/tables';
import ColumnFilter from '../ColumnFilter';
import { formatContactName } from '../../helpers/contact';

interface Props {
  options: ContactSummary[];
}

function ContractContactFilter(props: Props) {
  return (
    <ColumnFilter
      column="contactId"
      columnName="Contact"
      table={Tables.Contracts}
      options={props.options.map((o) => ({
        value: o.id,
        key: o.id,
        text: formatContactName(o.firstName, o.lastNamePreposition, o.lastName),
      }))}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  options: getSummaryCollection<ContactSummary>(state, SummaryCollections.Contacts).options,
});

export default connect(mapStateToProps)(ContractContactFilter);
