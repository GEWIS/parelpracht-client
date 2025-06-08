import { connect } from 'react-redux';
import { Image } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { Contract } from '../../../clients/server.generated';
import { getCompanyLogo, getCompanyName } from '../../../stores/company/selectors';
import { getContactName } from '../../../stores/contact/selectors';
import ResourceStatus from '../../../stores/resourceStatus';
import { getSingle } from '../../../stores/single/selectors';
import { SingleEntities } from '../../../stores/single/single';
import { RootState } from '../../../stores/store';
import { getUserName } from '../../../stores/user/selectors';
import CompanyLink from '../company/CompanyLink';
import UserLink from '../user/UserLink';
import { formatPriceFull } from '../../../helpers/monetary';
import { EntitySummary } from '../EntitySummary';

interface Props {
  contract: Contract | undefined;
  status: ResourceStatus;
  contactName: string;
  logoFilename: string;
}

function ContractSummary(props: Props) {
  const { t } = useTranslation();
  const { contract, status, contactName, logoFilename } = props;

  if (contract === undefined) {
    return <EntitySummary loading entity={SingleEntities.Contract} icon="file alternate" />;
  }

  const loading =
    status !== ResourceStatus.FETCHED && status !== ResourceStatus.SAVING && status !== ResourceStatus.ERROR;

  const totalPriceNoVat = contract.products.reduce((a, b) => a + (b.basePrice - b.discount), 0);

  const totalPriceWithVat = contract.products.reduce(
    (a, b) => a + (b.basePrice - b.discount) * (b.product.valueAddedTax.amount / 100 + 1),
    0,
  );

  const logo =
    logoFilename !== '' ? (
      <Image floated="right" src={`/static/logos/${logoFilename}`} style={{ maxHeight: '4rem', width: 'auto' }} />
    ) : (
      <div />
    );

  return (
    <EntitySummary
      loading={loading}
      entity={SingleEntities.Contract}
      icon="file alternate"
      title={`C${contract.id} ${contract.title}`}
      rightHeader={logo}
    >
      <div>
        <h5>{t('entity.company')}</h5>
        <CompanyLink id={contract.companyId} />
      </div>
      <div>
        <h5>{t('entity.contact')}</h5>
        <p>{contactName}</p>
      </div>
      <div>
        <h5>{t('entities.generalProps.assignedTo')}</h5>
        <UserLink id={contract.assignedToId} />
      </div>
      <div>
        <h5>{t('entities.contract.props.realPriceNoVat')}</h5>
        <p>{formatPriceFull(totalPriceNoVat)}</p>
      </div>
      <div>
        <h5>{t('entities.contract.props.realPriceWithVat')}</h5>
        <p>{formatPriceFull(totalPriceWithVat)}</p>
      </div>
    </EntitySummary>
  );
}

const mapStateToProps = (state: RootState) => {
  const { data, status } = getSingle<Contract>(state, SingleEntities.Contract);
  return {
    contract: data,
    status,
    companyName: data ? getCompanyName(state, data.companyId) : '...',
    logoFilename: data ? getCompanyLogo(state, data.companyId) : '',
    createdByName: data ? getUserName(state, data.createdById) : '...',
    contactName: data ? getContactName(state, data.contactId) : '...',
  };
};

export default connect(mapStateToProps)(ContractSummary);
