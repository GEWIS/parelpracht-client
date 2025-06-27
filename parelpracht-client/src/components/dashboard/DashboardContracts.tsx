import { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Client, RecentContract } from '../../clients/server.generated';
import DashboardContractsRow from './DashboardContractsRow';

type Props = WithTranslation;

interface State {
  contracts: RecentContract[];
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

  componentDidMount() {
    const client = new Client();
    this.setState({ loading: true });
    client
      .getRecentContracts()
      .then((contracts) => {
        this.setState({
          contracts,
          loading: false,
        });
      })
      .catch(console.error);
  }

  render() {
    const { t } = this.props;
    const { contracts, loading } = this.state;
    return (
      <Segment loading={loading}>
        <h3>{t('dashboard.recentContracts.header')}</h3>
        {contracts.map((c) => (
          <DashboardContractsRow contract={c} key={c.id} />
        ))}
        <div style={{ marginTop: '1em' }}>
          <NavLink to="/contract/">{t('dashboard.recentContracts.allContracts')}</NavLink>
        </div>
      </Segment>
    );
  }
}

export default withTranslation()(DashboardContracts);
