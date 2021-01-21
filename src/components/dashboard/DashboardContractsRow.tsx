import React from 'react';
import { connect } from 'react-redux';
import {
  Button, Header, Icon, Segment,
} from 'semantic-ui-react';
import { RecentContract } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { formatActivityDate } from '../../helpers/activity';
import { getUserName } from '../../stores/user/selectors';
import { getCompanyName } from '../../stores/company/selectors';

interface Props {
  contract: RecentContract;
  company: string;
  user: string;
}

function DashboardContractsRow(props: Props) {
  const { contract, company, user } = props;

  return (
    <Segment.Group
      horizontal
      style={{ margin: 0, marginTop: '0.2em' }}
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

const mapStateToProps = (state: RootState, props: { contract: RecentContract }) => ({
  company: getCompanyName(state, props.contract.companyId),
  user: getUserName(state, props.contract.createdById),
});

export default connect(mapStateToProps)(DashboardContractsRow);
