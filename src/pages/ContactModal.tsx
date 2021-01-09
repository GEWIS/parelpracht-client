import * as React from 'react';
import {
  Dimmer,
  Header,
  Loader,
  Modal, Segment,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { Contact, ContactFunction, Gender } from '../clients/server.generated';
import { clearSingle, fetchSingle } from '../stores/single/actionCreators';
import { RootState } from '../stores/store';
import ContactProps from '../components/contact/ContactProps';
import ResourceStatus from '../stores/resourceStatus';
import AlertContainer from '../components/alerts/AlertContainer';
import { getSingle } from '../stores/single/selectors';
import { SingleEntities } from '../stores/single/single';
import { TransientAlert } from '../stores/alerts/actions';
import { showTransientAlert } from '../stores/alerts/actionCreators';

interface Props extends RouteComponentProps<{ companyId: string, contactId?: string }> {
  create?: boolean;
  contact: Contact | undefined;
  status: ResourceStatus;

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
      this.close();
    }

    if (this.props.status === ResourceStatus.EMPTY
      && prevProps.status === ResourceStatus.DELETING
    ) {
      this.close();
      // TODO: Fix alert not showing up, because it seems to get dismissed when closing the modal
      this.props.showTransientAlert({
        title: 'Success',
        message: `Contact ${prevProps.contact?.firstName} successfully deleted`,
        type: 'success',
      });
    }
  }

  close = () => {
    const { companyId } = this.props.match.params;
    this.props.fetchCompany(parseInt(companyId, 10));
    this.props.history.goBack();
  };

  public render() {
    let contact: Contact | undefined;
    if (this.props.create) {
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
            contact={contact}
            create={this.props.create}
            onCancel={() => { }}
          />
          {
            contact.contracts === undefined || contact.contracts.length === 0 ? (
              <p>This user has no contracts</p>
            ) : (
              <Segment>
                <Header>Contracts:</Header>
                <ul>
                  {contact.contracts.map((contract) => {
                    return <li><NavLink to={`/contract/${contract.id}`}>{contract.title}</NavLink></li>;
                  })}
                </ul>
              </Segment>
            )
          }
        </Segment>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    contact: getSingle<Contact>(state, SingleEntities.Contact).data,
    status: getSingle<Contact>(state, SingleEntities.Contact).status,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  clearContact: () => dispatch(clearSingle(SingleEntities.Contact)),
  fetchContact: (id: number) => dispatch(fetchSingle(SingleEntities.Contact, id)),
  fetchCompany: (id: number) => dispatch(fetchSingle(SingleEntities.Company, id)),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContactModal));
