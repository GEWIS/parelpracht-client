import * as React from 'react';
import {
  Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Contract } from '../clients/server.generated';
import { fetchSingleContract, clearSingleContract } from '../stores/contract/actionCreators';
import { RootState } from '../stores/store';
import ContractProps from '../components/contract/ContractProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';

interface Props extends RouteComponentProps {
  status: ResourceStatus;

  clearContract: () => void;
}

class ContractCreatePage extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);

    props.clearContract();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      this.close();
    }
  }

  close = () => { this.props.history.push('/contract'); };

  public render() {
    const contract: Contract = {
      id: 0,
      companyId: 0,
      contactId: 0,
      comments: '',
      title: '',
    } as Contract;

    return (
      <Modal
        onClose={this.close}
        open
        dimmer="blurring"
        closeOnDimmerClick={false}
      >
        <Segment>
          <AlertContainer />
          <ContractProps contract={contract} create onCancel={this.close} />
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: state.contract.singleStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchContract: (id: number) => dispatch(fetchSingleContract(id)),
  clearContract: () => dispatch(clearSingleContract()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContractCreatePage));
