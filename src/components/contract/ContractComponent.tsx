import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Header, Icon, Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Contract } from '../../clients/server.generated';
import { getCompanyName } from '../../stores/company/selectors';
import { getContactName } from '../../stores/contact/selectors';
import './ContractComponent.scss';
import { RootState } from '../../stores/store';

interface Props extends RouteComponentProps {
  contract: Contract;

  contactName: string;
  companyName: string;
}

class ContractComponent extends React.Component<Props> {
  public render() {
    const { contract, companyName, contactName } = this.props;
    return (
      <Segment.Group
        horizontal
        className="contract-component"
        style={{ margin: 0, marginTop: '0.2em' }}
        onClick={() => {
          this.props.history.push(
            `/contract/${contract.id}`,
          );
        }}
      >
        <Segment
          as={Button}
          textAlign="left"
        >
          <Header>
            <Icon name="list alternate outline" size="large" />
            <Header.Content>
              {contract.title}
              <Header.Subheader>
                {companyName}
              </Header.Subheader>
              <Header.Subheader>
                {contactName}
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

const mapStateToProps = (state: RootState, props: { contract: Contract }) => {
  return {
    companyName: getCompanyName(state, props.contract.companyId),
    contactName: getContactName(state, props.contract.contactId),
  };
};

export default withRouter(connect(mapStateToProps)(ContractComponent));
