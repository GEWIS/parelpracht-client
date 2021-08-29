import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Header, Icon, Segment,
} from 'semantic-ui-react';
import { Contact, ContactFunction } from '../../../clients/server.generated';
import { formatContactName, formatFunction } from '../../../helpers/contact';
import './CompanyContact.scss';

interface Props extends RouteComponentProps {
  contact: Contact;
}

function CompanyContact(props: Props) {
  const { contact } = props;

  return (
    <Segment.Group
      horizontal
      className="company-contact"
      style={{ margin: 0, marginTop: '0.2em' }}
      onClick={() => {
        props.history.push(
          `${props.location.pathname}/contact/${contact.id}`,
        );
      }}
    >
      <Segment
        as={Button}
        textAlign="left"
        disabled={contact.function === ContactFunction.OLD}
      >
        <Header sub>
          <Icon name="user circle" size="large" />
          <Header.Content>
            {formatFunction(contact.function)}
            <Header.Subheader>
              {formatContactName(
                contact.firstName,
                contact.lastNamePreposition,
                contact.lastName,
              )}
            </Header.Subheader>
          </Header.Content>
        </Header>
      </Segment>
      <Button
        icon="eye"
        attached="right"
        basic
        onClick={() => { }}
      />
    </Segment.Group>
  );
}

export default withRouter(CompanyContact);
