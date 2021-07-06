/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { ProductStatus, ProductSummary } from '../../clients/server.generated';
import { RootState } from '../../stores/store';

interface Props {
  value: number;
  options: ProductSummary[];
  onChange: (value: number | number[]) => void;
}

function ProductSelector(props: Props & DropdownProps) {
  const [open, changeOpen] = useState(false);

  const {
    value, onChange, options,
  } = props;
  const dropdownOptions = options
    .filter((p) => p.status === ProductStatus.ACTIVE)
    .sort((p1, p2) => {
      const n1 = p1.nameEnglish.toUpperCase();
      const n2 = p2.nameEnglish.toUpperCase();
      if (n1 < n2) return -1;
      if (n1 > n2) return 1;
      return 0;
    })
    .map((x) => ({
      key: x.id,
      text: x.nameEnglish,
      value: x.id,
    }));

  return (
    <Dropdown
      placeholder="Product"
      search
      selection
      options={dropdownOptions}
      value={value < 0 ? '' : value}
      onChange={(e, data) => onChange(data.value as any)}
      error={(value < 1 && !open)}
      onOpen={() => changeOpen(true)}
      onClose={() => changeOpen(false)}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  options: state.summaries.Products.options,
});

export default connect(mapStateToProps)(ProductSelector);
