import { useState } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Roles, UserSummary } from '../../../clients/server.generated';
import { formatContactName } from '../../../helpers/contact';
import { RootState } from '../../../stores/store';

interface Props {
  value: number;
  options: UserSummary[];
  onChange: (value: number | number[]) => void;
  correct?: boolean;
  role?: Roles;
}

function UserSelector(props: Props & DropdownProps) {
  const [open, changeOpen] = useState(false);

  const { t } = useTranslation();
  const { value, onChange, options, correct, role } = props;

  const filteredOptions = role !== undefined ? options.filter((u) => u.roles.includes(role)) : options;
  const dropdownOptions = [...filteredOptions]
    .sort((u1, u2) => {
      const n1 = formatContactName(u1.firstName, u1.lastNamePreposition, u1.lastName).toUpperCase();
      const n2 = formatContactName(u2.firstName, u2.lastNamePreposition, u2.lastName).toUpperCase();
      if (n1 < n2) return -1;
      if (n1 > n2) return 1;
      return 0;
    })
    .map((x) => ({
      key: x.id,
      text: formatContactName(x.firstName, x.lastNamePreposition, x.lastName),
      value: x.id,
    }));

  return (
    <Dropdown
      placeholder={t('entity.user')}
      search
      selection
      fluid
      error={value < 1 && !open && correct !== true}
      options={dropdownOptions}
      value={props.value}
      onChange={(_, data) => onChange(data.value as number | number[])}
      onOpen={() => changeOpen(true)}
      onClose={() => changeOpen(false)}
    />
  );
}

const mapStateToProps = (state: RootState) => ({
  options: state.summaries.Users.options,
});

export default connect(mapStateToProps)(UserSelector);
