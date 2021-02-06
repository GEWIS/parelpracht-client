import React from 'react';
import { connect } from 'react-redux';
import {
  Button, Header, Icon, Segment,
} from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RecentContract } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { formatActivityDate } from '../../helpers/activity';
import { getUserName } from '../../stores/user/selectors';
import { getCompanyName } from '../../stores/company/selectors';

interface Props extends RouteComponentProps {
  contract: RecentContract;
  company: string;
  user: string;
}

class DashboardContractsRow extends React.Component<Props> {
  render() {
    const { contract, company, user } = this.props;
    return (
      <Segment.Group
        horizontal
        style={{ margin: 0, marginTop: '0.2em' }}
        onClick={() => {
          this.props.history.push(`./contract/${contract.id}`);
        }}
      >
        <Segment
          as={Button}
          textAlign="left"
        >
          <Header>
            <Icon name="briefcase" size="large" />
            <Header.Content>
              {company}
              {' - '}
              {contract.title}
              <Header.Subheader>
                {formatActivityDate(contract.updatedAt, user)}
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
      </Segment.Group>
    );
  }
}

const mapStateToProps = (state: RootState, props: { contract: RecentContract }) => ({
  company: getCompanyName(state, props.contract.companyId),
  user: getUserName(state, props.contract.createdById),
});

export default withRouter(connect(mapStateToProps)(DashboardContractsRow));
