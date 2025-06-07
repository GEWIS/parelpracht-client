import { Component } from "react";
import { Modal } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Contract } from '../clients/server.generated';
import { fetchSingle, clearSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ContractProps from '../components/entities/contract/ContractProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { SingleEntities } from '../stores/single/single';
import { getSingle } from '../stores/single/selectors';
import { TitleContext } from '../components/TitleContext';
import { withRouter, WithRouter } from '../WithRouter';

interface Props extends WithTranslation, WithRouter {
  status: ResourceStatus;

  clearContract: () => void;
  fetchCompany: (id: number) => void;
}

class ContractModal extends Component<Props> {
  componentDidMount() {
    this.props.clearContract();
  }

  componentDidUpdate(prevProps: Props) {
    const { t } = this.props;
    document.title = t('pages.contract.newContract');

    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      this.close();
    }
  }

  close = () => {
    const { params, navigate } = this.props.router;
    // If the modal is not opened on a company page, we cannot refresh the company information
    if (params.companyId !== undefined) {
      this.props.fetchCompany(parseInt(params.companyId, 10));
    }
    navigate(-1);
  };

  public render() {
    let compId = -1;
    let companyPredefined: boolean = false;
    const { params } = this.props.router;
    if (params.companyId) {
      compId = parseInt(params.companyId, 10);
      companyPredefined = true;
    }
    const contract: Contract = {
      id: -1,
      companyId: compId,
      contactId: -1,
      comments: '',
      title: '',
    } as Contract;

    return (
      <Modal
        onClose={this.close}
        closeIcon
        open
        dimmer="blurring"
        closeOnDimmerClick={false}
      >
        <Modal.Content>
          <AlertContainer />
          <ContractProps
            contract={contract}
            create
            companyPredefined={companyPredefined}
            onCancel={this.close}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: getSingle<Contract>(state, SingleEntities.Contract).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCompany: (id: number) => dispatch(fetchSingle(SingleEntities.Company, id)),
  fetchContract: (id: number) => dispatch(fetchSingle(SingleEntities.Contract, id)),
  clearContract: () => dispatch(clearSingle(SingleEntities.Contract)),
});

ContractModal.contextType = TitleContext;

export default withTranslation()(withRouter(connect(mapStateToProps,
  mapDispatchToProps)(ContractModal)));
