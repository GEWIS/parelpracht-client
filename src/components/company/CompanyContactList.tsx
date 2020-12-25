import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import {
  Button, Icon, Loader,
} from 'semantic-ui-react';
import { Company } from '../../clients/server.generated';
import { getSingle } from '../../stores/single/selectors';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import CompanyContact from './CompanyContact';

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

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompanyContactList));
