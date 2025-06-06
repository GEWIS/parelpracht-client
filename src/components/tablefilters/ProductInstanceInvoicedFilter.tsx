import { connect } from 'react-redux';
import ColumnFilter from '../ColumnFilter';
import { Tables } from '../../stores/tables/tables';
import { RootState } from '../../stores/store';
import { parseFinancialYear } from '../../helpers/timestamp';

interface Props {
  financialYears: number[];
}

function ProductInstanceInvoicedFilter(props: Props) {
  const options = [{ key: 0, value: -1, text: 'Not invoiced' }];

  props.financialYears.forEach((y) => {
    options.push({ key: y, value: y, text: parseFinancialYear(y) });
  });

  return (
    <ColumnFilter
      column="invoiced"
      columnName="invoice year"
      multiple
      table={Tables.ETCompanies}
      options={options}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  financialYears: state.general.financialYears,
});

export default connect(mapStateToProps)(ProductInstanceInvoicedFilter);
