import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { RootState } from '../../stores/store';
import { getInvoiceTitle } from '../../stores/invoice/selectors';

interface Props {
  id: number;

  invoiceTitle: string;
}

function InvoiceLink(props: Props) {
  const { id, invoiceTitle } = props;
  return (
    <NavLink to={`/invoice/${id}`}>
      <Icon name="euro sign" />
      F
      {id}
      {' '}
      {invoiceTitle}
    </NavLink>
  );
}

const mapStateToProps = (state: RootState, props: { id: number }) => {
  return {
    invoiceTitle: getInvoiceTitle(state, props.id),
  };
};

export default connect(mapStateToProps)(InvoiceLink);
