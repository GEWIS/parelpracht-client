import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Icon, Loader, Table,
} from 'semantic-ui-react';
import { Company } from '../../clients/server.generated';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import InvoiceComponent from './InvoiceComponent';

interface Props extends RouteComponentProps {
  company: Company | undefined;
}

interface State {

}

class InvoiceList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const { company } = this.props;

    if (company === undefined) {
      return (
        <Loader content="Loading" active />
      );
    }

    const { invoices } = company;

    if (invoices.length === 0) {
      return (
        <>
          <h3>
            Invoice
          </h3>
          <h4>
            There are no invoices yet.
          </h4>
        </>
      );
    }

    return (
      <>
        <h3>
          Invoice
        </h3>
        <Table compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Invoice ID
              </Table.HeaderCell>
              <Table.HeaderCell>
                Amount
              </Table.HeaderCell>
              <Table.HeaderCell>
                Status
              </Table.HeaderCell>
              <Table.HeaderCell>
                Last Update
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {invoices.map((x) => (
              <InvoiceComponent key={x.id} invoice={x} />))}
          </Table.Body>
        </Table>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    company: getSingle<Company>(state, SingleEntities.Company).data,
    status: getSingle<Company>(state, SingleEntities.Company).status,
  };
};

const mapDispatchToProps = () => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InvoiceList));
