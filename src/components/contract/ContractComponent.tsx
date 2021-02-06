import React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Table,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Contract, ContractStatus } from '../../clients/server.generated';
import { getCompanyName } from '../../stores/company/selectors';
import './ContractComponent.scss';
import { RootState } from '../../stores/store';
/* import TablePagination from '../TablePagination';
 */import { getContactName } from '../../stores/contact/selectors';
import { formatLastUpdate } from '../../helpers/timestamp';

interface Props extends RouteComponentProps {
  contract: Contract;

  contactName: string;
  companyName: string;
}

class ContractComponent extends React.Component<Props> {
  public render() {
    const { contract, contactName, companyName } = this.props;

    return (
      <>
        <Table.Row>
          <Table.Cell>
            <NavLink to={`/contract/${contract.id}`}>
              {contract.title}
            </NavLink>
          </Table.Cell>
          <Table.Cell>
            {contactName}
          </Table.Cell>
          <Table.Cell>
            {contract.id}
          </Table.Cell>
          <Table.Cell>
            {formatLastUpdate(contract.updatedAt)}
          </Table.Cell>
        </Table.Row>
      </>
    );
  }
}

const mapStateToProps = (state: RootState, props: { contract: Contract }) => {
  return {
    companyName: getCompanyName(state, props.contract.companyId),
    contactName: getContactName(state, props.contract.contactId),
  };
};

export default withRouter(connect(mapStateToProps)(ContractComponent));
