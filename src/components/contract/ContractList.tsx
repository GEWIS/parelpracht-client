import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Icon, Loader, Table,
} from 'semantic-ui-react';
import ContractComponent from './ContractComponent';
import { Company, Roles } from '../../clients/server.generated';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import AuthorizationComponent from '../AuthorizationComponent';

interface Props extends RouteComponentProps {
  company: Company | undefined;
}

interface State {

}

class ContractList extends React.Component<Props, State> {
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

    const { contracts } = company;

    if (contracts.length === 0) {
      return (
        <>
          <h3>
            Contracts
            <Button
              icon
              labelPosition="left"
              floated="right"
              style={{ marginTop: '-0.5em' }}
              basic
              as={NavLink}
              to={`${this.props.location.pathname}/contract/new`}
            >
              <Icon name="plus" />
              Add Contract
            </Button>
          </h3>
          <h4>
            There are no contracts yet.
          </h4>
        </>
      );
    }

    return (
      <>
        <h3>
          Contracts

          <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
            <Button
              icon
              labelPosition="left"
              floated="right"
              style={{ marginTop: '-0.5em' }}
              basic
              as={NavLink}
              to={`${this.props.location.pathname}/contract/new`}
            >
              <Icon name="plus" />
              Add Contract
            </Button>
          </AuthorizationComponent>
        </h3>
        <Table compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Title
              </Table.HeaderCell>
              <Table.HeaderCell>
                Contact
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
            {contracts.map((x) => (
              <ContractComponent contract={x} key={x.id} />))}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContractList));
