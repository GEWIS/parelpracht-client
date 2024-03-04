import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { ContactFunction, ContactSummary } from '../../../clients/server.generated';
import { formatContactName, formatFunctionShort, sortContactsByFunction } from '../../../helpers/contact';
import { RootState } from '../../../stores/store';

interface Props {
  disabled?: boolean;
  companyId: number;
  value: number;
  placeholder: string;
  options: ContactSummary[];
  onChange: (value: number | number[]) => void;
}

function ContactSelector(props: Props & DropdownProps) {
  const [open, changeOpen] = useState(false);

  const {
    value, onChange, options, disabled, companyId, placeholder,
  } = props;

  const dropdownOptions = sortContactsByFunction([...options], true)
    .filter((c) => c.companyId === companyId && c.function !== ContactFunction.OLD)
    .map((x) => ({
      key: x.id,
      text: formatContactName(x.firstName, x.lastNamePreposition, x.lastName),
      description: formatFunctionShort(x.function),
      value: x.id,
    }));

  return (
    <Dropdown
      placeholder={placeholder}
      disabled={disabled}
      search
      selection
      error={(value <= 0) && !open}
      options={dropdownOptions}
      value={value < 0 ? '' : value}
      onChange={(e, data) => onChange(data.value as any)}
      // Because the text is also red when error=true, we need to
      // keep a state whether the dropdown is open
      onOpen={() => changeOpen(true)}
      onClose={() => changeOpen(false)}
      fluid
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
