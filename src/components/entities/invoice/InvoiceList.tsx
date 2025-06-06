import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  Loader, Table,
} from 'semantic-ui-react';
import { Company } from '../../../clients/server.generated';
import { getSingle } from '../../../stores/single/selectors';
import { SingleEntities } from '../../../stores/single/single';
import { RootState } from '../../../stores/store';
import {WithRouter, withRouter} from '../../../WithRouter';
import InvoiceComponent from './InvoiceComponent';

interface Props extends WithTranslation, WithRouter {
  company: Company | undefined;
}

function InvoiceList({ company, t }: Props) {
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
          {t('entity.invoices')}
        </h3>
        <h4>
          {t('entities.product.noInvoice')}
        </h4>
      </>
    );
  }

  return (
    <>
      <h3>
        {t('entity.invoices')}
      </h3>
      <Table compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              {t('entities.invoice.props.title')}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {t('entities.generalProps.amount')}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {t('entities.generalProps.status')}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {t('entities.invoice.props.financialYear')}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {t('entities.generalProps.lastUpdate')}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {invoices.map((x) => <InvoiceComponent key={x.id} invoice={x} />)}
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

const mapDispatchToProps = () => ({
});

export default withTranslation()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(InvoiceList)),
);
