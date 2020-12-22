import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Contact } from '../../clients/server.generated';
import { formatContactName } from '../../helpers/contact';
import { getCompanyName } from '../../stores/company/selectors';
import { RootState } from '../../stores/store';
import { getSummary } from '../../stores/summaries/selectors';
import { SummaryCollections } from '../../stores/summaries/summaries';

interface Props {
  contact: Contact;
  companyName: string;
}

function ContactRow(props: Props) {
  const { contact, companyName } = props;
  return (
    <Table.Row>
      <Table.Cell>
        {formatContactName(contact.firstName, contact.middleName, contact.lastName)}
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
