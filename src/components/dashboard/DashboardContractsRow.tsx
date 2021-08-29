import React from 'react';
import { connect } from 'react-redux';
import {
  Button, Header, Icon, Segment, Image, Table,
} from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import { RecentContract } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { formatActivityDate } from '../../helpers/activity';
import { getUserName } from '../../stores/user/selectors';
import { getCompanyLogo, getCompanyName } from '../../stores/company/selectors';

interface Props extends RouteComponentProps, WithTranslation {
  contract: RecentContract;
  company: string;
  user: string;
  logoFilename: string;
}

class DashboardContractsRow extends React.Component<Props> {
  render() {
    const {
      contract, logoFilename, company, user,
    } = this.props;
    const logo = logoFilename !== '' ? (
      <Image
        fluid
        width={2}
        verticalAlign="middle"
        src={`/static/logos/${logoFilename}`}
        style={{
          margin: '0px',
          padding: '0px',
        }}
      />
    ) : <Icon name="briefcase" size="big" style={{ marginLeft: '0.3em' }} />;

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
          style={{ paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px' }}
        >
          <Table basic="very" style={{ padding: '0px', margin: '0px' }}>
            <Table.Row>
              <Table.Cell width={2} style={{ padding: '0px', margin: '0px' }}>
                {logo}
              </Table.Cell>
              <Table.Cell>
                <Header>
                  <Header.Content>
                    {company}
                    {' - '}
                    {contract.title}
                    <Header.Subheader>
                      {formatActivityDate(contract.updatedAt, user)}
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Table.Cell>
            </Table.Row>
          </Table>
        </Segment>
      </Segment.Group>
    );
  }
}

const mapStateToProps = (state: RootState, props: { contract: RecentContract }) => ({
  company: getCompanyName(state, props.contract.companyId),
  user: getUserName(state, props.contract.createdById),
  logoFilename: getCompanyLogo(state, props.contract.companyId),
});

export default withTranslation()(withRouter(connect(mapStateToProps)(DashboardContractsRow)));
