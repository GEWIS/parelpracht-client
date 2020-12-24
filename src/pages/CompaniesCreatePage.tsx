import * as React from 'react';
import {
  Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Company, CompanyStatus } from '../clients/server.generated';
import { clearSingleCompany } from '../stores/company/actionCreators';
import { RootState } from '../stores/store';
import CompanyProps from '../components/company/CompanyProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';

interface Props extends RouteComponentProps {
  status: ResourceStatus;

  clearCompany: () => void;
}

class CompaniesCreatePage extends React.Component<Props> {
  componentDidMount() {
    this.props.clearCompany();
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
      id: 0,
      name: '',
      description: '',
      phoneNumber: '',
      status: CompanyStatus.ACTIVE,
      comments: '',
      addressStreet: '',
      addressCity: '',
      addressPostalCode: '',
      addressCountry: '',
    } as any as Company;

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
  clearCompany: () => dispatch(clearSingleCompany()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompaniesCreatePage));
