/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { UserSummary } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import { RootState } from '../../stores/store';

interface Props {
  value: number;
  options: UserSummary[];
  onChange: (value: number | number[]) => void;
  hideEmail?: boolean;
  correct?: boolean;
}

function UserSelector(props: Props & DropdownProps) {
  const [open, changeOpen] = useState(false);

  const {
    value, onChange, options, hideEmail, correct,
  } = props;
  const dropdownOptions = options.map((x) => ({
    key: x.id,
    text: formatContactName(x.firstName, x.lastNamePreposition, x.lastName),
    description: hideEmail ? undefined : x.email,
    value: x.id,
  }));

  return (
    <Dropdown
      placeholder="User"
      search
      selection
      fluid
      error={(value < 1 && !open) && correct !== true}
      options={dropdownOptions}
      value={props.value}
      onChange={(e, data) => onChange(data.value as any)}
      onOpen={() => changeOpen(true)}
      onClose={() => changeOpen(false)}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  options: state.summaries.Users.options,
});

UserSelector.defaultProps = {
  correct: undefined,
  hideEmail: undefined,
};

export default connect(mapStateToProps)(UserSelector);
