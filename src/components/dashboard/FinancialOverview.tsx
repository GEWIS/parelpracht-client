import React from 'react';
import {
  Dropdown, Grid, Popup, Segment, Table,
} from 'semantic-ui-react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Client, DashboardProductInstanceStats } from '../../clients/server.generated';
import { dateToFinancialYear } from '../../helpers/timestamp';
import { formatPriceFull } from '../../helpers/monetary';
import './FinancialOverview.scss';
import { FinancialOverviewField } from './FinancialOverviewField';

interface Props extends RouteComponentProps, WithTranslation {}

interface State {
  data?: DashboardProductInstanceStats;
  financialYear: number;
  loading: boolean;
  redirect: boolean;
}

class FinancialOverview extends React.Component<Props, State> {
  private readonly chart: React.RefObject<Bar>;

  constructor(props: Props) {
    super(props);
    this.chart = React.createRef();
    this.state = {
      data: undefined,
      financialYear: dateToFinancialYear(new Date()),
      loading: true,
      redirect: false,
    };
  }

  async componentDidMount() {
    const { financialYear } = this.state;
    await this.updateGraph(financialYear);
  }

  shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>): boolean {
    return !nextState.redirect;
  }

  componentWillUnmount() {
    this.chart.current?.chartInstance.destroy();
  }

  // goToInsightsTable = (e: MouseEvent | undefined, data: any[]) => {
  //   if (data) {
  //     const bars = ['suggested', 'contracted', 'delivered', 'invoiced', 'paid'];
  //     // eslint-disable-next-line no-underscore-dangle
  //     const i = data[0]._index;
  //     // There is no way to list all paid invoices in the Insights table
  //     if (i < 4) {
  //       const { financialYear } = this.state;
  //       this.setState({ redirect: true });
  //       this.props.history.push(`/insights#${bars[i]}&${financialYear}`);
  //     }
  //   }
  // };

  goToInsightsTable = (status: 'suggested' | 'contracted' | 'delivered' | 'invoiced') => {
    const { financialYear } = this.state;
    this.props.history.push(`/insights#${status}&${financialYear}`);
  };

  async updateGraph(year: number) {
    this.setState({ loading: true });
    const client = new Client();
    const data = await client.getDashboardProductInstanceStatistics(year);
    this.setState({
      data,
      loading: false,
    });
  }

  createBarChartDataObject(): object {
    const { t } = this.props;
    const { data } = this.state;
    return {
      labels: [
        t('dashboard.financialOverview.suggested'),
        t('dashboard.financialOverview.contractedShort'),
        t('dashboard.financialOverview.delivered'),
        t('dashboard.financialOverview.invoiced'),
        t('dashboard.financialOverview.paid')],
      datasets: [
        {
          label: t('entities.graph.label.amount'),
          backgroundColor: 'rgba(41, 48, 101, 0.8)',
          borderColor: 'rgba(41, 48, 101, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255, 148, 128, 0.8)',
          hoverBorderColor: 'rgba(41, 48, 101, 1)',
          data: [data?.suggested.amount, data?.contracted.amount, data?.delivered.amount,
            data?.invoiced.delivered.amount, data?.paid.amount],
        },
        {
          label: t('dashboard.financialOverview.delivered'),
          backgroundColor: 'rgba(41, 48, 101, 0.8)',
          borderColor: 'rgba(41, 48, 101, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255, 148, 128, 0.8)',
          hoverBorderColor: 'rgba(41, 48, 101, 1)',
          data: [0, 0, 0, data?.invoiced.notDelivered.amount, 0],
        },
      ],
    };
  }

  async changeFinancialYear(value: number) {
    this.setState({ financialYear: value, loading: true });
    await this.updateGraph(value);
  }

  createDropdownOptions() {
    const { data } = this.state;
    const financialYears = data?.financialYears || [];
    const result: object[] = [];
    financialYears.forEach((y: number) => {
      result.push({
        key: y, value: y, text: `${(y - 1).toString()} - ${y.toString()}`,
      });
    });
    return result;
  }

  render() {
    const { t } = this.props;
    const { loading, data, financialYear } = this.state;
    const chartData = this.createBarChartDataObject();
    return (
      <Segment loading={loading} className="financial-overview">
        <Grid style={{ marginBottom: '1em' }}>
          <Grid.Row columns={2}>
            <Grid.Column textAlign="left">
              <h3>{t('dashboard.financialOverview.header')}</h3>
            </Grid.Column>
            <Grid.Column textAlign="right" verticalAlign="bottom" style={{ fontSize: '1.2em' }}>
              <Dropdown
                options={this.createDropdownOptions()}
                basic
                value={financialYear}
                float="right"
                onChange={(value, d) => this.changeFinancialYear(d.value as number)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div>
          <Bar
            ref={this.chart}
            data={chartData}
            options={{
              legend: {
                display: false,
              },
              scales: {
                xAxes: [{
                  stacked: true,
                }],
                yAxes: [{
                  stacked: true,
                  ticks: {
                    beginAtZero: true,
                    callback(value: number) {
                      return formatPriceFull(value);
                    },
                  },
                }],
              },
              tooltips: {
                callbacks: {
                  label(tooltipItem: any) {
                    return formatPriceFull(tooltipItem.yLabel);
                  },
                },
              },
              // onClick: this.goToInsightsTable,
              // onHover: (event, chartElement) => {
              //   // @ts-ignore
              //   // eslint-disable-next-line no-param-reassign
              //   event.target!.style.cursor = chartElement[0] ? 'pointer' : 'default';
              // },
            }}
          />
        </div>
        <Table celled definition style={{ marginTop: '2em' }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>
                <Popup
                  trigger={(
                    <span>
                      {t('dashboard.financialOverview.suggested')}
                    </span>
                  )}
                  header={t('dashboard.financialOverview.suggested')}
                  content={t('dashboard.financialOverview.description.suggested')}
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Popup
                  trigger={(
                    <span>
                      {t('dashboard.financialOverview.contracted')}
                    </span>
                  )}
                  header={t('dashboard.financialOverview.contracted')}
                  content={t('dashboard.financialOverview.description.contracted')}
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Popup
                  trigger={(
                    <span>
                      {t('dashboard.financialOverview.delivered')}
                    </span>
                  )}
                  header={t('dashboard.financialOverview.delivered')}
                  content={t('dashboard.financialOverview.description.delivered')}
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Popup
                  trigger={(
                    <span>
                      {t('dashboard.financialOverview.invoiced')}
                    </span>
                  )}
                  header={t('dashboard.financialOverview.invoiced')}
                  content={t('dashboard.financialOverview.description.invoiced')}
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Popup
                  trigger={(
                    <span>
                      {t('dashboard.financialOverview.paid')}
                    </span>
                  )}
                  header={t('dashboard.financialOverview.paid')}
                  content={t('dashboard.financialOverview.description.paid')}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{t('dashboard.financialOverview.value')}</Table.Cell>
              <Table.Cell onClick={() => this.goToInsightsTable('suggested')}>
                <FinancialOverviewField
                  fields={[t('dashboard.financialOverview.suggested')]}
                  values={[data?.suggested.amount || 0]}
                  type="value"
                />
              </Table.Cell>
              <Table.Cell onClick={() => this.goToInsightsTable('contracted')}>
                <FinancialOverviewField
                  fields={[t('dashboard.financialOverview.contracted')]}
                  values={[data?.contracted.amount || 0]}
                  type="value"
                />
              </Table.Cell>
              <Table.Cell onClick={() => this.goToInsightsTable('delivered')}>
                <FinancialOverviewField
                  fields={[t('dashboard.financialOverview.delivered')]}
                  values={[data?.delivered.amount || 0]}
                  type="value"
                />
              </Table.Cell>
              <Table.Cell onClick={() => this.goToInsightsTable('invoiced')}>
                <FinancialOverviewField
                  fields={[t('dashboard.financialOverview.delivered'), t('dashboard.financialOverview.notDelivered')]}
                  values={[
                    data?.invoiced.delivered.amount || 0, data?.invoiced.notDelivered.amount || 0]}
                  type="value"
                  header={t('dashboard.financialOverview.invoiced')}
                />
              </Table.Cell>
              <Table.Cell>
                <FinancialOverviewField
                  fields={[t('dashboard.financialOverview.paid')]}
                  values={[data?.paid.amount || 0]}
                  type="value"
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{t('dashboard.financialOverview.nrOfProducts')}</Table.Cell>
              <Table.Cell onClick={() => this.goToInsightsTable('suggested')}>
                <FinancialOverviewField
                  fields={[t('dashboard.financialOverview.suggested')]}
                  values={[data?.suggested.nrOfProducts || 0]}
                  type="amount"
                />
              </Table.Cell>
              <Table.Cell onClick={() => this.goToInsightsTable('contracted')}>
                <FinancialOverviewField
                  fields={[t('dashboard.financialOverview.contracted')]}
                  values={[data?.contracted.nrOfProducts || 0]}
                  type="amount"
                />
              </Table.Cell>
              <Table.Cell onClick={() => this.goToInsightsTable('delivered')}>
                <FinancialOverviewField
                  fields={[t('dashboard.financialOverview.delivered')]}
                  values={[data?.delivered.nrOfProducts || 0]}
                  type="amount"
                />
              </Table.Cell>
              <Table.Cell onClick={() => this.goToInsightsTable('delivered')}>
                <FinancialOverviewField
                  fields={[t('dashboard.financialOverview.delivered'), t('dashboard.financialOverview.notDelivered')]}
                  values={[
                    data?.invoiced.delivered.nrOfProducts || 0,
                    data?.invoiced.notDelivered.nrOfProducts || 0]}
                  type="amount"
                  header={t('dashboard.financialOverview.invoiced')}
                />
              </Table.Cell>
              <Table.Cell>
                <FinancialOverviewField
                  fields={[t('dashboard.financialOverview.paid')]}
                  values={[data?.paid.nrOfProducts || 0]}
                  type="amount"
                />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

      </Segment>
    );
  }
}

export default withTranslation()(withRouter(FinancialOverview));
