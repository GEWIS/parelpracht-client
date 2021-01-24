/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { ContactSummary } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import { RootState } from '../../stores/store';

interface Props {
  disabled?: boolean;
  companyId: number;
  value: number;
  options: ContactSummary[];
  onChange: (value: number | number[]) => void;
}

function ContactSelector(props: Props & DropdownProps) {
  const [open, changeOpen] = useState(false);

  const {
    value, onChange, options, disabled, companyId, ...rest
  } = props;
  const dropdownOptions = props.options
    .filter((c) => c.companyId === companyId)
    .map((x) => ({
      key: x.id,
      text: formatContactName(x.firstName, x.lastNamePreposition, x.lastName),
      description: x.companyName,
      value: x.id,
    }));

  return (
    <Dropdown
      placeholder="Contact"
      disabled={disabled}
      search
      selection
      error={!(value > -1) && !open}
      {...rest}
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

ContactSelector.defaultProps = {
  disabled: false,
};

const mapStateToProps = (state: RootState) => ({
  options: state.summaries.Contacts.options,
});

export default connect(mapStateToProps)(ContactSelector);
