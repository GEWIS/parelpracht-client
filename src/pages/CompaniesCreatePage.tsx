import * as React from 'react';
import {
  Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {Company, CompanyStatus, Invoice} from '../clients/server.generated';
import { fetchSingleCompany, clearSingleCompany } from '../stores/company/actionCreators';
import { RootState } from '../stores/store';
import CompanyProps from '../components/companies/CompanyProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';

interface Props extends RouteComponentProps {
  status: ResourceStatus;

  clearCompany: () => void;
}

class CompaniesCreatePage extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);

    props.clearCompany();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      this.close();
    }
  }

  close = () => { this.props.history.push('/company'); };

  public render() {
    let company = new Company();
    company = {
      ...company,
      id: 0,
      name: '',
      description: '',
      phoneNumber: '',
      status: CompanyStatus.ACTIVE,
      comments: '',
    } as any;

    return (
      <Modal
        onClose={this.close}
        open
        dimmer="blurring"
        closeOnDimmerClick={false}
      >
        <Segment>
          <AlertContainer />
          <CompanyProps company={company} create onCancel={this.close} />
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: state.company.singleStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCompany: (id: number) => dispatch(fetchSingleCompany(id)),
  clear: () => dispatch(clearSingleCompany()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompaniesCreatePage));
