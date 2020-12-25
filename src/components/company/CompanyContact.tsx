import React from 'react';
import {
  Button, Grid, Header, Icon, Menu, Segment,
} from 'semantic-ui-react';
import { Contact } from '../../clients/server.generated';
import { formatContactName, formatFunction } from '../../helpers/contact';
import './CompanyContact.scss';

interface Props {
  contact: Contact;
}

class CompanyContact extends React.Component<Props> {
  public render() {
    const { contact } = this.props;
    return (
      <Segment.Group horizontal className="company-contact">
        <Segment>
          <Header sub>
            <Icon name="user circle" size="large" />
            <Header.Content>
              {formatFunction(contact.function)}
              <Header.Subheader>
                {formatContactName(
                  contact.firstName,
                  contact.middleName,
                  contact.lastName,
                )}
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
        <Button icon="pencil" attached="right" basic />
      </Segment.Group>
    );
  }
}

export default CompanyContact;
