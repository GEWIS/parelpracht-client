import React from 'react';
import { Loader, Table } from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Client, Role } from '../../clients/server.generated';
import RoleTableRow from './RoleTableRow';

interface Props extends WithTranslation {}

interface State {
  roles: Role[];
  loading: boolean;
}

class RoleTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      roles: [],
      loading: true,
    };
  }

  async componentDidMount() {
    const client = new Client();
    const roles = await client.getAllRoles();
    this.setState({
      roles,
      loading: false,
    });
  }

  updateTable = (role: Role) => {
    const { roles } = this.state;
    const index = roles.findIndex((r) => r.name === role.name);
    if (!index) return;
    roles[index].ldapGroup = role.ldapGroup;
    this.setState({ roles });
  };

  render() {
    const { t } = this.props;
    const { roles, loading } = this.state;

    const contractList = (
      <Table compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell style={{ width: '150px' }}>
              {t('pages.settings.roles.header.roleName')}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {t('pages.settings.roles.header.ldapGroup')}
            </Table.HeaderCell>
            <Table.HeaderCell style={{ width: '110px' }} />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {roles.map((r) => (<RoleTableRow role={r} updateTable={this.updateTable} key={`${r.name}`} />))}
        </Table.Body>
      </Table>
    );

    return (
      <>
        <h3>Roles</h3>
        <Loader active={loading} />
        {contractList}
      </>
    );
  }
}

export default withTranslation()(RoleTable);
