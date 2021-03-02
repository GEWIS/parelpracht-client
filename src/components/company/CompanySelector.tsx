/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { CompanySummary } from '../../clients/server.generated';
import { RootState } from '../../stores/store';

interface Props {
  value: number;
  options: CompanySummary[];
  onChange: (value: number | number[]) => void;
  disabled?: boolean;
}

function CompanySelector(props: Props & DropdownProps) {
  const [open, changeOpen] = useState(false);

  const {
    value, onChange, options, disabled,
  } = props;
  const dropdownOptions = options.map((x) => ({
    key: x.id,
    text: x.name,
    value: x.id,
  }));

  return (
    <Dropdown
      placeholder="Company"
      disabled={disabled}
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

CompanySelector.defaultProps = {
  disabled: false,
};

const mapStateToProps = (state: RootState) => ({
  options: state.summaries.Companies.options,
});

export default connect(mapStateToProps)(CompanySelector);
