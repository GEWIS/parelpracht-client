import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Button, Input, Table } from 'semantic-ui-react';
import { Client, Partial_RoleParams_, Role } from '../../clients/server.generated';

interface Props extends WithTranslation {
  role: Role;

  updateTable: (role: Role) => void;
}

interface State {
  editing: boolean;
  ldapGroup: string;

  saving: boolean;
}

class RoleTableRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      editing: false,
      ldapGroup: props.role.ldapGroup,
      saving: false,
    };
  }

  save = async () => {
    const { role, updateTable } = this.props;
    const { ldapGroup } = this.state;
    this.setState({ saving: true });
    const client = new Client();
    const newRole = await client.updateRole(role.name, new Partial_RoleParams_({ ldapGroup }));
    updateTable(newRole);
    this.setState({ saving: false, editing: false });
  };

  cancel = () => {
    const { role } = this.props;
    this.setState({ editing: false, ldapGroup: role.ldapGroup });
  };

  render() {
    const { role, t } = this.props;
    const { editing, ldapGroup, saving } = this.state;

    if (!editing) {
      return (
        <Table.Row>
          <Table.Cell>
            {t(`entities.user.props.roles.${role.name.toLowerCase()}`)}
          </Table.Cell>
          <Table.Cell>
            <span title={role.ldapGroup}>{role.ldapGroup}</span>
          </Table.Cell>
          <Table.Cell>
            <Button
              icon="pencil"
              primary
              onClick={() => this.setState({ editing: true })}
              title={t('buttons.files.edit')}
            />
          </Table.Cell>
        </Table.Row>
      );
    }
    return (
      <Table.Row>
        <Table.Cell>
          {t(`entities.user.props.roles.${role.name.toLowerCase()}`)}
        </Table.Cell>
        <Table.Cell>
          <Input
            id={`form-role-${role.name}-ldap-group-name`}
            // fluid={false}
            fluid
            placeholder="LDAP group name"
            value={ldapGroup}
            onChange={(event) => this.setState({ ldapGroup: event.target.value })}
          />
        </Table.Cell>
        <Table.Cell>
          <Button
            icon="x"
            negative
            onClick={this.cancel}
            title={t('buttons.files.cancel')}
          />
          <Button
            icon="save"
            positive
            onClick={this.save}
            loading={saving}
            title={t('buttons.files.save')}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default withTranslation()(RoleTableRow);
