/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { CategorySummary } from '../../clients/server.generated';
import { RootState } from '../../stores/store';

interface Props {
  value: number;
  options: CategorySummary[];
  onChange: (value: number | number[]) => void;
}

function ProductCategorySelector(props: Props & DropdownProps) {
  const [open, changeOpen] = useState(false);

  const {
    value, onChange, options,
  } = props;
  const dropdownOptions = options.map((x) => ({
    key: x.id,
    text: x.name,
    description: x.name,
    value: x.id,
  }));

  return (
    <Dropdown
      placeholder="Product Category"
      fluid
      search
      selection
      error={!(value > -1) && !open}
      options={dropdownOptions}
      value={value}
      onChange={(e, data) => onChange(data.value as any)}
      // Because the text is also red when error=true, we need to
      // keep a state whether the dropdown is open
      onOpen={() => changeOpen(true)}
      onClose={() => changeOpen(false)}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  options: state.summaries.ProductCategories.options,
});

export default connect(mapStateToProps)(ProductCategorySelector);
