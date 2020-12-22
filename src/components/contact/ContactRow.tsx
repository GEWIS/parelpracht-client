import React from 'react';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Contact } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';

interface Props {
  contact: Contact;
}

export function ContactRow(props: Props) {
  const { contact } = props;
  return (
    <Table.Row>
      <Table.Cell>
        {formatContactName(contact.firstName, contact.middleName, contact.lastName)}
      </Table.Cell>
      <Table.Cell>
        <NavLink to={`/contact/${contact.id}`}>
          {contact.companyId}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        <NavLink to={`/contact/${contact.id}`}>
          {contact.email}
        </NavLink>
      </Table.Cell>
    </Table.Row>
  );
}
