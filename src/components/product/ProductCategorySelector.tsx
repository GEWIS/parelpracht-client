/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
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
  const {
    value, onChange, options, ...rest
  } = props;
  const dropdownOptions = props.options.map((x) => ({
    key: x.id,
    text: x.name,
    description: x.name,
    value: x.id,
  }));

  return (
    <Dropdown
      placeholder="Product Category"
      search
      selection
      {...rest}
      options={dropdownOptions}
      value={props.value}
      onChange={(e, data) => props.onChange(data.value as any)}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  options: state.summaries.ProductCategories.options,
});

export default connect(mapStateToProps)(ProductCategorySelector);
