import React from 'react';
import { Table } from 'semantic-ui-react';
import { ETCompany } from '../../helpers/extensiveTableObjects';
import ContractExtensiveRow from './ContractExtensiveRow';

interface Props {
  companies: ETCompany[];
  column: string;
  direction: 'ascending' | 'descending';
  total: number;
  fetched: number;
  skip: number;
  take: number;
}

function ContractTableExtensive(props: Props) {
  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Company</Table.HeaderCell>
            <Table.HeaderCell>Contract</Table.HeaderCell>
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Invoiced</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Details</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.companies.map((c) => <ContractExtensiveRow company={c} />)}
        </Table.Body>
      </Table>
    </>
  );
}
