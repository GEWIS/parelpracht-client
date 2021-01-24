/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
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
  const {
    value, onChange, options, disabled, ...rest
  } = props;
  const dropdownOptions = props.options.map((x) => ({
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
      {...rest}
      options={dropdownOptions}
      value={props.value}
      onChange={(e, data) => props.onChange(data.value as any)}
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
