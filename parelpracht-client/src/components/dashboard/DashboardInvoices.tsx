import { Component } from 'react';
import { Segment, Table } from 'semantic-ui-react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Client, ExpiredInvoice } from '../../clients/server.generated';
import DashboardInvoicesRow from './DashboardInvoicesRow';
import './DashboardInvoices.scss';

type Props = WithTranslation;

interface State {
  invoices: ExpiredInvoice[];
  loading: boolean;
}

class DashboardInvoices extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      invoices: [],
      loading: false,
    };
  }

  componentDidMount() {
    const client = new Client();
    this.setState({ loading: true });
    client
      .getExpiredInvoices()
      .then((invoices) => {
        this.setState({
          invoices,
          loading: false,
        });
      })
      .catch(console.error);
  }

  render() {
    const { t } = this.props;
    const { invoices } = this.state;

    return (
      <Segment loading={this.state.loading}>
        <h3>{t('dashboard.expiredInvoices.header')}</h3>
        <Table striped compact fixed singleLine className="expired-invoices" unstackable>
          <Table.Body>
            {invoices.map((i) => (
              <DashboardInvoicesRow invoice={i} key={i.id} />
            ))}
          </Table.Body>
        </Table>
      </Segment>
    );
  }
}

export default withTranslation()(DashboardInvoices);
