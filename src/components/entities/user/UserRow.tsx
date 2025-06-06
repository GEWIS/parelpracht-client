import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Checkbox, Table } from 'semantic-ui-react';
import { Roles, User } from '../../../clients/server.generated';
import { formatContactName } from '../../../helpers/contact';

interface Props {
  user: User;
}

function UserRow(props: Props) {
  const { user } = props;

  const permissions = {
    roleGeneral: user.roles.find((r) => r.name as Roles === Roles.GENERAL) !== undefined,
    roleSignee: user.roles.find((r) => r.name as Roles === Roles.SIGNEE) !== undefined,
    roleFinancial: user.roles.find((r) => r.name as Roles === Roles.FINANCIAL) !== undefined,
    roleAudit: user.roles.find((r) => r.name as Roles === Roles.AUDIT) !== undefined,
    roleAdmin: user.roles.find((r) => r.name as Roles === Roles.ADMIN) !== undefined,
  };

  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/user/${user.id}`}>
          {formatContactName(user.firstName, user.lastNamePreposition, user.lastName)}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        {user.email}
      </Table.Cell>
      <Table.Cell textAlign="center">
        <Checkbox
          disabled
          toggle
          checked={permissions.roleSignee}
        />
      </Table.Cell>
      <Table.Cell textAlign="center">
        <Checkbox
          disabled
          toggle
          checked={permissions.roleFinancial}
        />
      </Table.Cell>
      <Table.Cell textAlign="center">
        <Checkbox
          disabled
          toggle
          checked={permissions.roleGeneral}
        />
      </Table.Cell>
      <Table.Cell textAlign="center">
        <Checkbox
          disabled
          toggle
          checked={permissions.roleAudit}
        />
      </Table.Cell>
      <Table.Cell textAlign="center">
        <Checkbox
          disabled
          toggle
          checked={permissions.roleAdmin}
        />
      </Table.Cell>
    </Table.Row>
  );
}

export default connect()(UserRow);
