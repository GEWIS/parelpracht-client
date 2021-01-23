import React from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Company, CompanyStatus } from '../../clients/server.generated';
import { formatLastUpdate } from '../../helpers/timestamp';

interface Props {
  company: Company;
}

export function CompanyRow(props: Props) {
  const { company } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/company/${company.id}`}>
          {company.name}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        {company.status === CompanyStatus.ACTIVE ? 'Active' : 'Inactive'}
      </Table.Cell>
      <Table.Cell>
        {formatLastUpdate(company.updatedAt)}
      </Table.Cell>
    </Table.Row>
  );
}
