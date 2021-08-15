import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Icon, Loader,
} from 'semantic-ui-react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Company, Roles } from '../../../clients/server.generated';
import { getSingle } from '../../../stores/single/selectors';
import { SingleEntities } from '../../../stores/single/single';
import { RootState } from '../../../stores/store';
import AuthorizationComponent from '../../AuthorizationComponent';
import CompanyContact from './CompanyContact';
import { sortContactsByFunction } from '../../../helpers/contact';

interface Props extends WithTranslation, RouteComponentProps {
  company: Company | undefined;
}

interface State {

}

class CompanyContactList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const { company, t } = this.props;

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
            {t('entity.contacts')}
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
                {t('pages.contacts.addContact')}
              </Button>
            </AuthorizationComponent>
          </h3>
          <h4>
            {t('pages.contacts.noContact')}
          </h4>
        </>
      );
    }

    return (
      <>
        <h3>
          {t('entity.contacts')}
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
            {t('pages.contacts.addContact')}
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

const mapDispatchToProps = () => ({
});

export default withTranslation()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(CompanyContactList)),
);
