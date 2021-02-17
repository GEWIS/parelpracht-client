import React from 'react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Table,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getCompanyName } from '../../stores/company/selectors';
import { RootState } from '../../stores/store';
/* import TablePagination from '../TablePagination'; */
import { formatLastUpdate } from '../../helpers/timestamp';
import { Invoice } from '../../clients/server.generated';

interface Props extends RouteComponentProps {
  invoice: Invoice;

}

class InvoiceComponent extends React.Component<Props> {
  public render() {
    const { invoice } = this.props;

    return (
      <>
        <Table.Row>
          <Table.Cell>
            <NavLink to={`/invoice/${invoice.id}`}>
              {invoice.id}
            </NavLink>
          </Table.Cell>
          <Table.Cell>
            {invoice.id}
          </Table.Cell>
          <Table.Cell>
            {invoice.id}
          </Table.Cell>
          <Table.Cell>
            {formatLastUpdate(invoice.updatedAt)}
          </Table.Cell>
        </Table.Row>
      </>
    );
  }
}

const mapStateToProps = (state: RootState, props: { invoice: Invoice }) => {
  return {
    companyName: getCompanyName(state, props.invoice.companyId),
  };
};

export default withRouter(connect(mapStateToProps)(InvoiceComponent));
