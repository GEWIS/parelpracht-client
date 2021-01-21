import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import { Client, RecentContract } from '../../clients/server.generated';
import DashboardContractsRow from './DashboardContractsRow';

interface Props {}

interface State {
  contracts: RecentContract[]
  loading: boolean;
}

class DashboardContracts extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      contracts: [],
      loading: false,
    };
  }

  async componentDidMount() {
    const client = new Client();
    this.setState({ loading: true });
    const contracts = await client.getRecentContracts();
    this.setState({
      contracts,
      loading: false,
    });
  }

  render() {
    const { contracts, loading } = this.state;
    return (
      <Segment loading={loading}>
        <h3>Recent contracts</h3>
        {contracts.map((c) => <DashboardContractsRow contract={c} key={c.id} />)}
      </Segment>
    );
  }
}

export default DashboardContracts;
