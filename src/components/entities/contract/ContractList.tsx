import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Button, Icon, Loader, Table } from 'semantic-ui-react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Company, Roles } from '../../../clients/server.generated';
import { getSingle } from '../../../stores/single/selectors';
import { SingleEntities } from '../../../stores/single/single';
import { RootState } from '../../../stores/store';
import AuthorizationComponent from '../../AuthorizationComponent';
import { withRouter, WithRouter } from '../../../WithRouter';
import ContractComponent from './ContractComponent';

interface Props extends WithTranslation, WithRouter {
  company: Company | undefined;
}

function ContractList({ company, t, router }: Props) {
  const { location } = router;

  if (company === undefined) {
    return <Loader content="Loading" active />;
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
            to={`${location.pathname}/contract/new`}
          >
            <Icon name="plus" />
            {t('pages.contracts.addContract')}
          </Button>
        </h3>
        <h4>{t('entities.product.noContract')}</h4>
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
            to={`${location.pathname}/contract/new`}
          >
            <Icon name="plus" />
            {t('pages.contracts.addContract')}
          </Button>
        </AuthorizationComponent>
      </h3>
      <Table compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t('entities.contract.props.title')}</Table.HeaderCell>
            <Table.HeaderCell>{t('entity.contact')}</Table.HeaderCell>
            <Table.HeaderCell>{t('entities.generalProps.status')}</Table.HeaderCell>
            <Table.HeaderCell>{t('entities.generalProps.lastUpdate')}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {contracts.map((x) => (
            <ContractComponent contract={x} key={x.id} />
          ))}
        </Table.Body>
      </Table>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    company: getSingle<Company>(state, SingleEntities.Company).data,
    status: getSingle<Company>(state, SingleEntities.Company).status,
  };
};

const mapDispatchToProps = () => ({});

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ContractList)));
