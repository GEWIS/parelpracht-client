import React from 'react';
import { connect } from 'react-redux';
import {
  Image,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Invoice } from '../../../clients/server.generated';
import ResourceStatus from '../../../stores/resourceStatus';
import { getSingle } from '../../../stores/single/selectors';
import { SingleEntities } from '../../../stores/single/single';
import { RootState } from '../../../stores/store';
import CompanyLink from '../company/CompanyLink';
import UserLink from '../user/UserLink';
import { formatPriceFull } from '../../../helpers/monetary';
import { getCompanyLogo } from '../../../stores/company/selectors';
import { EntitySummary } from '../EntitySummary';

interface Props {
  invoice: Invoice | undefined;
  status: ResourceStatus;
  logoFilename: string;
}

function InvoiceSummary(props: Props) {
  const { t } = useTranslation();
  const { invoice, status, logoFilename } = props;
  if (invoice === undefined) {
    return (
      <EntitySummary
        loading
        entity={SingleEntities.Invoice}
        icon="money bill alternate outline"
      />
    );
  }

  const loading = (status !== ResourceStatus.FETCHED
    && status !== ResourceStatus.SAVING
    && status !== ResourceStatus.ERROR);

  const totalValue = invoice.products
    .reduce((a, b) => a + (b.basePrice - b.discount), 0);

  const logo = logoFilename !== '' ? (
    <Image
      floated="right"
      src={`/static/logos/${logoFilename}`}
      style={{ maxHeight: '4rem', width: 'auto' }}
    />
  ) : <div />;

  return (
    <EntitySummary
      loading={loading}
      entity={SingleEntities.Invoice}
      icon="money bill alternate outline"
      title={`F${invoice.id} ${invoice.title}`}
      rightHeader={logo}
    >
      <div>
        <h5>{t('entity.company')}</h5>
        <CompanyLink id={invoice.companyId} />
      </div>
      <div>
        <h5>{t('entities.generalProps.createdBy')}</h5>
        <UserLink id={invoice.createdById} />
      </div>
      <div>
        <h5>{t('entities.generalProps.assignedTo')}</h5>
        <UserLink id={invoice.assignedToId} />
      </div>
      <div>
        <h5>{t('entities.invoice.props.totalValue')}</h5>
        <p>{formatPriceFull(totalValue)}</p>
      </div>
    </EntitySummary>
  );
}

const mapStateToProps = (state: RootState) => {
  const { data, status } = getSingle<Invoice>(state, SingleEntities.Invoice);
  return {
    invoice: data,
    status,
    logoFilename: data ? getCompanyLogo(state, data.companyId) : '',
  };
};

export default connect(mapStateToProps)(InvoiceSummary);
