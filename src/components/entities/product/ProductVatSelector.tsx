/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { VATSummary } from '../../../clients/server.generated';
import { RootState } from '../../../stores/store';

interface Props {
  value: number;
  options: VATSummary[];
  onChange: (value: number | number[]) => void;
}

function ProductVATSelector(props: Props & DropdownProps) {
  const [open, changeOpen] = useState(false);

  const {
    value, onChange, options,
  } = props;

  const dropdownOptions = options.sort((v1, v2) => {
    return v1.amount >= v2.amount ? 1 : -1;
  }).map((x) => ({
    key: x.id,
    text: `${x.amount}%`,
    value: x.id,
  }));

  return (
    <Dropdown
      placeholder="Product VAT"
      fluid
      search
      selection
      error={!(value > -1) && !open}
      options={dropdownOptions}
      value={value < 0 ? '' : value}
      onChange={(e, data) => onChange(data.value as any)}
      // Because the text is also red when error=true, we need to
      // keep a state whether the dropdown is open
      onOpen={() => changeOpen(true)}
      onClose={() => changeOpen(false)}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  options: state.summaries.ValueAddedTax.options,
});

export default connect(mapStateToProps)(ProductVATSelector);
