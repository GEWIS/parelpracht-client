import React from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Contact } from '../../../clients/server.generated';
import { formatContactName, formatFunction } from '../../../helpers/contact';
import CompanyLink from '../company/CompanyLink';

interface Props {
  contact: Contact;
}

function ContactRow(props: Props) {
  const { contact } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/contact/${contact.id}`}>
          {formatContactName(contact.firstName, contact.lastNamePreposition, contact.lastName)}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <CompanyLink id={contact.companyId} />
      </Table.Cell>
      <Table.Cell>
        {contact.email}
      </Table.Cell>
      <Table.Cell>
        {formatFunction(contact.function)}
      </Table.Cell>
    </Table.Row>
  );
}

export default ContactRow;
