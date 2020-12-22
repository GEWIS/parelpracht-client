import React from 'react';
import { Grid, Icon, Segment } from 'semantic-ui-react';
import { Contact } from '../../clients/server.generated';
import { formatContactName, formatFunction } from '../../helpers/contact';

interface Props {
  contact: Contact;
}

class CompanyContact extends React.Component<Props> {
  public render() {
    const { contact } = this.props;
    return (
      <Segment>
        <Grid columns={3}>
          <Grid.Column width={1}>
            <Icon name="user circle" size="large" />
          </Grid.Column>
          <Grid.Column>
            <b>
              {formatContactName(
                contact.firstName,
                contact.middleName,
                contact.lastName,
              )}
            </b>
          </Grid.Column>
          <Grid.Column>
            {formatFunction(contact.function)}
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default CompanyContact;
