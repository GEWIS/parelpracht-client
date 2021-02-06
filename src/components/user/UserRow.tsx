import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Checkbox, Table } from 'semantic-ui-react';
import { Roles, User } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import { RootState } from '../../stores/store';

interface Props {
  user: User;
}

function UserRow(props: Props) {
  const { user } = props;

  const permissions = {
    roleGeneral: user.roles.find((r) => r.name === Roles.GENERAL) !== undefined,
    roleSignee: user.roles.find((r) => r.name === Roles.SIGNEE) !== undefined,
    roleFinancial: user.roles.find((r) => r.name === Roles.FINANCIAL) !== undefined,
    roleAudit: user.roles.find((r) => r.name === Roles.AUDIT) !== undefined,
    roleAdmin: user.roles.find((r) => r.name === Roles.ADMIN) !== undefined,
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

const mapStateToProps = (state: RootState, props: { user: User }) => ({
});

export default connect(mapStateToProps)(UserRow);
