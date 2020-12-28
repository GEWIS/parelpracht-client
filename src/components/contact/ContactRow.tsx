import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Contact } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import { getCompanyName } from '../../stores/company/selectors';
import { RootState } from '../../stores/store';

interface Props {
  contact: Contact;
  companyName: string;
}

function ContactRow(props: Props) {
  const { contact, companyName } = props;
  return (
    <Table.Row>
      <Table.Cell>
        <NavLink to={`/contact/${contact.id}`}>
          {formatContactName(contact.firstName, contact.middleName, contact.lastName)}
        </NavLink>
      </Table.Cell>
      <Table.Cell>
        {companyName}
      </Table.Cell>
      <Table.Cell>
        {contact.email}
      </Table.Cell>
    </Table.Row>
  );
}

const mapStateToProps = (state: RootState, props: { contact: Contact }) => {
  return {
    companyName: getCompanyName(state, props.contact.companyId),
  };
};

export default connect(mapStateToProps)(ContactRow);
