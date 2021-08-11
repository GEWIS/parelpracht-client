import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Icon, Loader, Table,
} from 'semantic-ui-react';
import { WithTranslation, withTranslation } from 'react-i18next';
import ContractComponent from './ContractComponent';
import { Company, Roles } from '../../../clients/server.generated';
import { getSingle } from '../../../stores/single/selectors';
import { SingleEntities } from '../../../stores/single/single';
import { RootState } from '../../../stores/store';
import AuthorizationComponent from '../../AuthorizationComponent';

interface Props extends WithTranslation, RouteComponentProps {
  company: Company | undefined;
}

interface State {

}

class ContractList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const { company, t } = this.props;

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
            {t('entity.contracts')}
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
              {t('pages.contracts.addContract')}
            </Button>
          </h3>
          <h4>
            {t('products.noContract')}
          </h4>
        </>
      );
    }

    return (
      <>
        <h3>
          {t('entity.contracts')}

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
              {t('pages.contracts.addContract')}
            </Button>
          </AuthorizationComponent>
        </h3>
        <Table compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {t('pages.tables.generalColumns.title')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('pages.tables.generalColumns.contact')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('pages.tables.generalColumns.status')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('pages.tables.generalColumns.lastUpdate')}
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

export default withTranslation()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(ContractList)),
);
