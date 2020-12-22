import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Loader } from 'semantic-ui-react';
import { Company } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import CompanyContact from './CompanyContact';

interface Props {
  company: Company | undefined;
}

interface State {

}

class CompanyContactList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const { company } = this.props;

    if (company === undefined) {
      return (
        <Loader content="Loading" active />
      );
    }

    const { contacts } = company;
    return (
      <>
        <h3>Contacts</h3>
        {contacts.map((contact) => (
          <CompanyContact key={contact.id} contact={contact} />
        ))}
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    company: state.company.single,
    status: state.company.singleStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CompanyContactList);
