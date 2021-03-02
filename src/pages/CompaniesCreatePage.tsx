import * as React from 'react';
import {
  Modal,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Company, CompanyStatus } from '../clients/server.generated';
import { clearSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import CompanyProps from '../components/company/CompanyProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';

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

  close = () => { this.props.history.goBack(); };

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
        closeIcon
        dimmer="blurring"
        closeOnDimmerClick={false}
      >
        <Modal.Content>
          <AlertContainer />
          <Modal.Description>
            <CompanyProps company={company} create onCancel={this.close} />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<Company>(state, SingleEntities.Company).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  clearCompany: () => dispatch(clearSingle(SingleEntities.Company)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompaniesCreatePage));
