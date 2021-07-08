import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Icon, Loader,
} from 'semantic-ui-react';
import { Company, Roles } from '../../clients/server.generated';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import AuthorizationComponent from '../AuthorizationComponent';
import CompanyContact from './CompanyContact';
import { sortContactsByFunction } from '../../helpers/contact';

interface Props extends RouteComponentProps {
  company: Company | undefined;
}

interface State {

}

class CompanyContactList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const { company } = this.props;

    if (company === undefined) {
      return (
        <Loader content="Loading" active />
      );
    }

    const { contacts } = company;
    sortContactsByFunction(contacts, true);

    if (contacts.length === 0) {
      return (
        <>
          <h3>
            Contacts
            <Button
              icon
              labelPosition="left"
              floated="right"
              style={{ marginTop: '-0.5em' }}
              basic
              as={NavLink}
              to={`${this.props.location.pathname}/contact/new`}
            >
              <Icon name="plus" />
              Add Contact
            </Button>
          </h3>
          <h4>
            There are no contacts yet.
          </h4>
        </>
      );
    }

    return (
      <>
        <h3>
          Contacts
          <AuthorizationComponent
            roles={[Roles.GENERAL, Roles.ADMIN]}
            notFound={false}
          >
            <Button
              icon
              labelPosition="left"
              floated="right"
              style={{ marginTop: '-0.5em' }}
              basic
              as={NavLink}
              to={`${this.props.location.pathname}/contact/new`}
            >
              <Icon name="plus" />
              Add Contact
            </Button>
          </AuthorizationComponent>
        </h3>
        {contacts.map((contact) => (
          <CompanyContact key={contact.id} contact={contact} />
        ))}
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    company: getSingle<Company>(state, SingleEntities.Company).data,
    status: getSingle<Company>(state, SingleEntities.Company).status,
  };
};

const mapDispatchToProps = () => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompanyContactList));
