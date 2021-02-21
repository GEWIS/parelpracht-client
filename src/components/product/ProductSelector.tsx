/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { ProductSummary } from '../../clients/server.generated';
import { RootState } from '../../stores/store';

interface Props {
  value: number;
  options: ProductSummary[];
  onChange: (value: number | number[]) => void;
}

function ProductSelector(props: Props & DropdownProps) {
  const {
    value, onChange, options,
  } = props;
  const dropdownOptions = options.map((x) => ({
    key: x.id,
    text: x.nameDutch,
    description: x.nameEnglish,
    value: x.id,
  }));

  return (
    <Dropdown
      placeholder="Product"
      search
      selection
      options={dropdownOptions}
      value={value}
      onChange={(e, data) => onChange(data.value as any)}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  options: state.summaries.Products.options,
});

export default connect(mapStateToProps)(ProductSelector);
