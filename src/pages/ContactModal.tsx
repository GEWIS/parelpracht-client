import * as React from 'react';
import {
  Dimmer,
  Header,
  Loader,
  Modal, Segment, Table,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  Contact, ContactFunction, ContractStatus, Gender,
} from '../clients/server.generated';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ContactProps from '../components/entities/contact/ContactProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import { TransientAlert } from '../stores/alerts/actions';
import { showTransientAlert } from '../stores/alerts/actionCreators';
import { formatContactName } from '../helpers/contact';
import { formatStatus } from '../helpers/activity';
import { getContractStatus } from '../stores/contract/selectors';
import CompanyLink from '../components/entities/company/CompanyLink';
import { TitleContext } from '../components/TitleContext';

interface Props extends RouteComponentProps<{ companyId: string, contactId?: string }>,
  WithTranslation {
  create?: boolean;
  onCompanyPage: boolean;
  contact: Contact | undefined;
  status: ResourceStatus;
  getContractStatus: (id: number) => ContractStatus;

  clearContact: () => void;
  fetchContact: (id: number) => void;
  fetchCompany: (id: number) => void;
  showTransientAlert: (alert: TransientAlert) => void;
}

class ContactModal extends React.Component<Props> {
  componentDidMount() {
    this.props.clearContact();

    const { contactId } = this.props.match.params;
    if (!this.props.create && contactId !== undefined) {
      this.props.fetchContact(parseInt(contactId, 10));
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.status === ResourceStatus.FETCHED
      && prevProps.status === ResourceStatus.SAVING
    ) {
      this.closeWithPopupMessage();
    }

    if (this.props.status === ResourceStatus.EMPTY
      && prevProps.status === ResourceStatus.DELETING
    ) {
      this.closeWithPopupMessage();

      this.props.showTransientAlert({
        title: 'Success',
        message: `Contact ${formatContactName(
          prevProps.contact?.firstName,
          prevProps.contact?.lastNamePreposition,
          prevProps.contact?.lastName,
        )} successfully deleted`,
        type: 'success',
        displayTimeInMs: 3000,
      });
    }
  }

  closeWithPopupMessage = () => {
    const { companyId } = this.props.match.params;

    // If the modal is not opened on a company page, we cannot refresh the company information
    if (companyId !== undefined) {
      this.props.fetchCompany(parseInt(companyId, 10));
    }
    if (companyId === undefined) {
      this.props.history.push('/contact');
    } else {
      this.props.history.push(`/company/${companyId}`);
    }
  };

  close = () => {
    const { companyId } = this.props.match.params;
    // If the modal is not opened on a company page, we cannot refresh the company information
    if (companyId !== undefined) {
      this.props.fetchCompany(parseInt(companyId, 10));
    }
    this.props.history.goBack();
  };

  public render() {
    const { t } = this.props;
    let contact: Contact | undefined;

    if (this.props.create) {
      this.context.setTitle(t('entities.contact.newContact'));
      const { companyId } = this.props.match.params;
      contact = {
        id: 0,
        firstName: '',
        lastNamePreposition: '',
        lastName: '',
        gender: Gender.UNKNOWN,
        email: '',
        telephone: '',
        comments: '',
        function: ContactFunction.NORMAL,
        companyId,
      } as any as Contact;
    } else {
      contact = this.props.contact;
    }

    if (contact === undefined) {
      this.context.setTitle(t('entity.contact'));
      return (
        <Modal
          onClose={this.close}
          closeIcon
          open
          dimmer="blurring"
          size="tiny"
        >
          <Segment placeholder attached="bottom">
            <AlertContainer />
            <Dimmer active inverted>
              <Loader />
            </Dimmer>
          </Segment>
        </Modal>
      );
    }

    this.context.setTitle(formatContactName(contact.firstName, contact.lastName, contact.lastName));

    let contractOverview;

    if (this.props.create) {
      contractOverview = '';
    } else if (contact.contracts === undefined || contact.contracts.length === 0) {
      contractOverview = <p>{t('entities.product.noContract')}</p>;
    } else {
      contractOverview = (
        <Segment>
          <Header>{t('entity.contracts')}</Header>
          <Table>
            <Table.Header>
              <Table.HeaderCell>
                {t('entities.contract.props.title')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('entity.company')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {t('entities.generalProps.status')}
              </Table.HeaderCell>
            </Table.Header>
            {contact.contracts.map((contract) => {
              return (
                <Table.Row>
                  <Table.Cell>
                    <NavLink to={`/contract/${contract.id}`}>{contract.title}</NavLink>
                  </Table.Cell>
                  <Table.Cell>
                    <CompanyLink id={contract.companyId} />
                  </Table.Cell>
                  <Table.Cell>
                    {formatStatus(this.props.getContractStatus(contract.id))}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table>
        </Segment>
      );
    }

    return (
      <Modal
        onClose={this.close}
        open
        closeIcon
        dimmer="blurring"
        size="tiny"
      >
        <Segment attached="bottom">
          <AlertContainer />
          <ContactProps
            onCompanyPage={this.props.onCompanyPage}
            contact={contact}
            create={this.props.create}
            onCancel={() => { this.close(); }}
          />
          {contractOverview}
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    contact: getSingle<Contact>(state, SingleEntities.Contact).data,
    status: getSingle<Contact>(state, SingleEntities.Contact).status,
    getContractStatus: (id: number) => getContractStatus(state, id),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  clearContact: () => dispatch(clearSingle(SingleEntities.Contact)),
  fetchContact: (id: number) => dispatch(fetchSingle(SingleEntities.Contact, id)),
  fetchCompany: (id: number) => dispatch(fetchSingle(SingleEntities.Company, id)),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

ContactModal.contextType = TitleContext;

export default withTranslation()(withRouter(connect(mapStateToProps,
  mapDispatchToProps)(ContactModal)));
