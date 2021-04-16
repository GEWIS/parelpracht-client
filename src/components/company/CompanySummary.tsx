import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Grid, Header, Icon, Loader, Placeholder, Segment,
} from 'semantic-ui-react';
import { Company, Roles } from '../../clients/server.generated';
import { formatStatus } from '../../helpers/activity';
import ResourceStatus from '../../stores/resourceStatus';
import { fetchSingle } from '../../stores/single/actionCreators';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import AuthorizationComponent from '../AuthorizationComponent';
import LogoAvatarModal from '../files/LogoAvatarModal';

interface Props {
  company: Company | undefined;
  status: ResourceStatus;
  fetchCompany: (id: number) => void;
}

function CompanySummary(props: Props) {
  const { company, status, fetchCompany } = props;
  if (company === undefined) {
    return (
      <>
        <Header as="h1" attached="top" style={{ backgroundColor: 'rgba(238, 238, 238, 0.98)' }}>
          <Loader active inline style={{ marginRight: '1rem', marginLeft: '1rem', marginTop: '0.5rem' }} />
          <Header.Content>
            <Header.Subheader>Company</Header.Subheader>
          </Header.Content>
        </Header>
        <Segment attached="bottom" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Placeholder><Placeholder.Line length="long" /></Placeholder>
        </Segment>
      </>
    );
  }

  if (status === ResourceStatus.FETCHING || status === ResourceStatus.SAVING) {
    return (
      <>
        <Header as="h1" attached="top" style={{ backgroundColor: 'rgba(238, 238, 238, 0.98)' }}>
          <Grid>
            <Grid.Row columns="2">
              <Grid.Column>
                <Loader active inline style={{ marginRight: '0.75rem', marginLeft: '0.75rem', marginTop: '0.75rem' }} />
                <Header.Content style={{ paddingLeft: '0.75rem' }}>
                  <Header.Subheader>Company</Header.Subheader>
                  {company.name}
                </Header.Content>
              </Grid.Column>
              <Grid.Column>
                <LogoAvatarModal
                  entity={SingleEntities.Company}
                  entityId={company.id}
                  entityName={company.name}
                  fileName={company.logoFilename}
                  fetchEntity={fetchCompany}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Header>
        <Segment attached="bottom" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Grid columns={4}>
            <Grid.Column>
              <h5>Description</h5>
              <p style={{ wordWrap: 'break-word' }}>{company.comments}</p>
            </Grid.Column>
            <Grid.Column>
              <h5>Status</h5>
              <p>{formatStatus(company.status)}</p>
            </Grid.Column>
          </Grid>
        </Segment>
      </>
    );
  }

  return (
    <>
      <Header as="h1" attached="top" style={{ backgroundColor: 'rgba(238, 238, 238, 0.98)' }}>
        <Grid>
          <Grid.Row columns="2">
            <Grid.Column>
              <Grid columns="equal">
                <Grid.Column width="1">
                  <Icon name="building" size="large" style={{ padding: '0.5rem' }} />
                </Grid.Column>
                <Grid.Column>
                  <Header.Content style={{ paddingLeft: '1.5rem' }}>
                    <Header.Subheader>Company</Header.Subheader>
                    {company.name}
                  </Header.Content>
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column>
              <AuthorizationComponent
                roles={[Roles.GENERAL, Roles.ADMIN]}
                notFound={false}
              >
                <LogoAvatarModal
                  entity={SingleEntities.Company}
                  entityId={company.id}
                  entityName={company.name}
                  fileName={company.logoFilename}
                  fetchEntity={fetchCompany}
                />
              </AuthorizationComponent>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Header>
      <Segment attached="bottom" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <Grid columns={4}>
          <Grid.Column>
            <h5>Description</h5>
            <p style={{ wordWrap: 'break-word' }}>{company.comments}</p>
          </Grid.Column>
          <Grid.Column>
            <h5>Status</h5>
            <p>{formatStatus(company.status)}</p>
          </Grid.Column>
        </Grid>
      </Segment>
    </>
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
