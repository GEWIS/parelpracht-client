import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Company } from '../../../clients/server.generated';
import { formatStatus } from '../../../helpers/activity';
import ResourceStatus from '../../../stores/resourceStatus';
import { fetchSingle } from '../../../stores/single/actionCreators';
import { getSingle } from '../../../stores/single/selectors';
import { SingleEntities } from '../../../stores/single/single';
import { RootState } from '../../../stores/store';
import LogoAvatarModal from '../../files/LogoAvatarModal';
import { EntitySummary } from '../EntitySummary';

interface Props {
  company: Company | undefined;
  status: ResourceStatus;
  fetchCompany: (id: number) => void;
}

function CompanySummary(props: Props) {
  const { company, status, fetchCompany } = props;

  if (company === undefined) {
    return (
      <EntitySummary
        loading
        entity={SingleEntities.Company}
        icon="building"
      />
    );
  }

  const loading = (status !== ResourceStatus.FETCHED
    && status !== ResourceStatus.SAVING
    && status !== ResourceStatus.ERROR);

  const logo = (
    <LogoAvatarModal
      entity={SingleEntities.Company}
      entityId={company.id}
      entityName={company.name}
      fileName={company.logoFilename}
      fetchEntity={fetchCompany}
    />
  );

  return (
    <EntitySummary
      loading={loading}
      entity={SingleEntities.Company}
      icon="building"
      title={company.name}
      rightHeader={logo}
    >
      <div>
        <h5>Description</h5>
        <p style={{ wordWrap: 'break-word' }}>{company.comments}</p>
      </div>
      <div>
        <h5>Status</h5>
        <p>{formatStatus(company.status)}</p>
      </div>
    </EntitySummary>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCompany: (id: number) => dispatch(fetchSingle(SingleEntities.Company, id)),
});

const mapStateToProps = (state: RootState) => {
  return {
    company: getSingle<Company>(state, SingleEntities.Company).data,
    status: getSingle<Company>(state, SingleEntities.Company).status,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanySummary);
