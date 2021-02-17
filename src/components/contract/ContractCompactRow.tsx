import React from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Contract, ContractStatus } from '../../clients/server.generated';
import CompanyLink from '../company/CompanyLink';
import ContractLink from './ContractLink';
import { formatLastUpdate } from '../../helpers/timestamp';
import { RootState } from '../../stores/store';
import { getContractStatus } from '../../stores/contract/selectors';
import { formatStatus } from '../../helpers/activity';

interface Props {
  contract: Contract,

  status: ContractStatus,
}

function ContractCompactRow(props: Props) {
  const { contract, status } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <ContractLink id={contract.id} showId={false} showName />
      </Table.Cell>
      <Table.Cell>
        <CompanyLink id={contract.companyId} />
      </Table.Cell>
      <Table.Cell>
        {formatStatus(status)}
      </Table.Cell>
      <Table.Cell>
        {formatLastUpdate(contract.updatedAt)}
      </Table.Cell>
    </Table.Row>
  );
}

const mapStateToProps = (state: RootState, props: { contract: Contract }) => {
  return {
    status: getContractStatus(state, props.contract.id),
  };
};

export default connect(mapStateToProps)(ContractCompactRow);
