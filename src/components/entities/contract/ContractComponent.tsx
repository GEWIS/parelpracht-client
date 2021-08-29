import React from 'react';
import {
  Table,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Contract, ContractStatus } from '../../../clients/server.generated';
import { getCompanyName } from '../../../stores/company/selectors';
import './ContractComponent.scss';
import { RootState } from '../../../stores/store';
import { getContactName } from '../../../stores/contact/selectors';
import { getContractStatus } from '../../../stores/contract/selectors';
import { formatLastUpdate } from '../../../helpers/timestamp';
import { formatStatus } from '../../../helpers/activity';
import ContractLink from './ContractLink';

interface Props {
  contract: Contract;
  contactName: string;
  status: ContractStatus;
}

function ContractComponent(props: Props) {
  const { contract, contactName, status } = props;

  return (
    <>
      <Table.Row>
        <Table.Cell>
          <ContractLink id={contract.id} showId showName />
        </Table.Cell>
        <Table.Cell>
          {contactName}
        </Table.Cell>
        <Table.Cell>
          {formatStatus(status)}
        </Table.Cell>
        <Table.Cell>
          {formatLastUpdate(contract.updatedAt)}
        </Table.Cell>
      </Table.Row>
    </>
  );
}

const mapStateToProps = (state: RootState, props: { contract: Contract }) => {
  return {
    status: getContractStatus(state, props.contract.id),
    companyName: getCompanyName(state, props.contract.companyId),
    contactName: getContactName(state, props.contract.contactId),
  };
};

export default connect(mapStateToProps)(ContractComponent);
