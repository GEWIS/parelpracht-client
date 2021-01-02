import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Contract } from '../../clients/server.generated';
import { getCompanyName } from '../../stores/company/selectors';
import { getContactName } from '../../stores/contact/selectors';
import { RootState } from '../../stores/store';
import { formatLastUpdate } from '../../helpers/lastUpdate';

interface Props {
  contract: Contract;

  contactName: string;
  companyName: string;
}

function ContractRow(props: Props) {
  const { contract, companyName, contactName } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/contract/${contract.id}`}>
          {contract.title}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        {companyName}
      </Table.Cell>
      <Table.Cell>
        {contactName}
      </Table.Cell>
      <Table.Cell>
        {formatLastUpdate(contract.updatedAt)}
      </Table.Cell>
    </Table.Row>
  );
}

const mapStateToProps = (state: RootState, props: { contract: Contract }) => {
  return {
    companyName: getCompanyName(state, props.contract.companyId),
    contactName: getContactName(state, props.contract.contactId),
  };
};

export default connect(mapStateToProps)(ContractRow);
