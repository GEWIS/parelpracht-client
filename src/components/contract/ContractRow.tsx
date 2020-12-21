import React from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Contract } from '../../clients/server.generated';
import { formatPriceFull } from '../../helpers/monetary';

interface Props {
  contract: Contract;
}

export function ContractRow(props: Props) {
  const { contract } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/contract/${contract.id}`}>
          {contract.title}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <NavLink to={`/contract/${contract.id}`}>
          {contract.companyId}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <NavLink to={`/contract/${contract.id}`}>
          {contract.contactId}
        </NavLink>
      </Table.Cell>
    </Table.Row>
  );
}
