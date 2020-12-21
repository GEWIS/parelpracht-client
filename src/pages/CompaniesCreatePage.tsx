import * as React from 'react';
import {
  Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Company, CompanyStatus } from '../clients/server.generated';
import { fetchSingleCompany, clearSingleCompany } from '../stores/company/actionCreators';
import { RootState } from '../stores/store';
import ProductProps from '../product/ProductProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';

interface Props extends RouteComponentProps {
  status: ResourceStatus;


}

class CompaniesCreatePage extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);


  }
}

componentDidUpdate(prevProps: Props) {
  if (prevProps.status === ResourceStatus.SAVING
    && this.props.status === ResourceStatus.FETCHED) {
    this.close();
  }
}

close = () => { this.props.history.push('/company'); };

public render() {
  const company: Company = {
    id: 0,
    name: '',
    desription: '',
    phoneNumber: '',
    comments: '',
    status: CompanyStatus.ACTIVE,
    lastUpdated: '',
    endDate: '',
    // contracts: Contract[],
    // invoices: Invoice[],
    // contacts: Contact[],
    // statusChange: Status[],
  } as Company;

  return (

  )
}

const mapStateToProps = (state: RootState) => {
  return {

  };
}

const mapDispatchToProps = (dispatch: Dispatch) => ({

});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompaniesCreatePage));