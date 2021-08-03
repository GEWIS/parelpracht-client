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

class CompanyContact extends React.Component<Props> {
  public render() {
    const { contact } = this.props;
    return (
      <Segment.Group
        horizontal
        className="company-contact"
        style={{ margin: 0, marginTop: '0.2em' }}
        onClick={() => {
          this.props.history.push(
            `${this.props.location.pathname}/contact/${contact.id}`,
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
}

export default withRouter(CompanyContact);
