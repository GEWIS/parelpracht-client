/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { UserSummary } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import { RootState } from '../../stores/store';

interface Props {
  value: number;
  options: UserSummary[];
  onChange: (value: number | number[]) => void;
  // eslint-disable-next-line react/require-default-props
  hideEmail?: boolean;
}

function UserSelector(props: Props & DropdownProps) {
  const {
    value, onChange, options, hideEmail, ...rest
  } = props;
  const dropdownOptions = props.options.map((x) => ({
    key: x.id,
    text: formatContactName(x.firstName, x.middleName, x.lastName),
    description: hideEmail ? undefined : x.email,
    value: x.id,
  }));

  return (
    <Dropdown
      placeholder="User"
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
  options: state.summaries.Users.options,
});

export default connect(mapStateToProps)(UserSelector);
