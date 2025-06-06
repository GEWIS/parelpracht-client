import { Tables } from '../../stores/tables/tables';
import ColumnFilter from '../ColumnFilter';
import { ContactFunction } from '../../clients/server.generated';
import { formatFunction } from '../../helpers/contact';

interface Props {
  table: Tables,
}

function ContactFunctionFilter(props: Props) {
  const options = Object.values(ContactFunction).map((o) => ({
    value: o, key: o, text: formatFunction(o),
  }));

  return (
    <ColumnFilter
      column="function"
      columnName="Function"
      table={props.table}
      options={options}
    />
  );
}

export default ContactFunctionFilter;
