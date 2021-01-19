import React from 'react';
import { Table } from 'semantic-ui-react';
import { ETCompany, ETContract } from '../../helpers/extensiveTableObjects';

interface Props {
  company: ETCompany;
}

function ContractExtensiveRow(props: Props) {
  const { company } = props;

  const getNrOfProducts = () => {
    let count = 0;
    for (let i = 0; i < company.contracts.length; i++) {
      count += company.contracts[0].products.length;
    }
    return count;
  };

  const drawRemainingContracts = (contract: ETContract) => {
    return (
      <Table.Row />
    );
  };

  return (
    <>
      <Table.Row>
        <Table.Cell rowSpan={getNrOfProducts()}>
          {company.name}
        </Table.Cell>
        {company.contracts.map((contract) => (
          <Table.Cell />
        ))}
      </Table.Row>
    </>
  );
}

export default ContractExtensiveRow;
