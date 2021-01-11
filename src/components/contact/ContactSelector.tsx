/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { ContactSummary } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import { RootState } from '../../stores/store';

interface Props {
  value: number;
  options: ContactSummary[];
  onChange: (value: number | number[]) => void;
}

function ContactSelector(props: Props & DropdownProps) {
  const {
    value, onChange, options, ...rest
  } = props;
  const dropdownOptions = props.options.map((x) => ({
    key: x.id,
    text: formatContactName(x.firstName, x.lastNamePreposition, x.lastName),
    description: x.companyName,
    value: x.id,
  }));

  return (
    <Dropdown
      placeholder="Contact"
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
  options: state.summaries.Contacts.options,
});

export default connect(mapStateToProps)(ContactSelector);
