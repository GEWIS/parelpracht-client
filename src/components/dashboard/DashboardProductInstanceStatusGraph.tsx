import React from 'react';
import {
  Dropdown, Grid, Popup, Segment, Table,
} from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';
import { Client, DashboardProductInstanceStats } from '../../clients/server.generated';
import { dateToFinancialYear } from '../../helpers/timestamp';
import { formatPriceFull } from '../../helpers/monetary';

interface Props {}

interface State {
  data?: DashboardProductInstanceStats;
  financialYear: number;
  loading: boolean;
}

class DashboardProductInstanceStatusGraph extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: undefined,
      financialYear: dateToFinancialYear(new Date()),
      loading: true,
    };
  }

  async componentDidMount() {
    const { financialYear } = this.state;
    await this.updateGraph(financialYear);
  }

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
    const { data } = this.state;
    return {
      labels: ['Suggested', 'Contracted', 'Delivered', 'Invoiced', 'Paid'],
      datasets: [
        {
          label: 'Amount',
          backgroundColor: 'rgba(41, 48, 101, 0.8)',
          borderColor: 'rgba(41, 48, 101, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255, 148, 128, 0.8)',
          hoverBorderColor: 'rgba(41, 48, 101, 1)',
          data: [data?.suggested.amount, data?.contracted.amount, data?.delivered.amount,
            data?.invoiced.delivered.amount, data?.paid.amount],
        },
        {
          label: 'Not delivered',
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
    const { loading, data, financialYear } = this.state;
    const chartData = this.createBarChartDataObject();
    return (
      <Segment loading={loading}>
        <Grid style={{ marginBottom: '1em' }}>
          <Grid.Row columns={2}>
            <Grid.Column textAlign="left">
              <h3>Financial Overview</h3>
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
                      Suggested
                    </span>
                  )}
                  header="Suggested"
                  content="The total value of contracts that have not been confirmed by a company."
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Popup
                  trigger={(
                    <span>
                      Contracted
                    </span>
                  )}
                  header="Contracted"
                  content="The total value of all delivered and not-delivered products on confirmed contracts.
                  Note that products that are already invoiced in a previous academic year
                  or products that are deferred to next academic year, are not included here."
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Popup
                  trigger={(
                    <span>
                      Delivered
                    </span>
                  )}
                  header="Delivered"
                  content="The total value of delivered products on confirmed contracts in the current academic year."
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Popup
                  trigger={(
                    <span>
                      Invoiced
                    </span>
                  )}
                  header="Invoiced"
                  content="The total value of all products invoiced in the current academic year."
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Popup
                  trigger={(
                    <span>
                      Paid
                    </span>
                  )}
                  header="Paid"
                  content="The total value of all paid invoices in the current academic year."
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Value</Table.Cell>
              <Table.Cell>{formatPriceFull(data?.suggested.amount || 0)}</Table.Cell>
              <Table.Cell>{formatPriceFull(data?.contracted.amount || 0)}</Table.Cell>
              <Table.Cell>{formatPriceFull(data?.delivered.amount || 0)}</Table.Cell>
              <Table.Cell>
                <Popup
                  content={(
                    <>
                      Delivered:
                      {' '}
                      {formatPriceFull(data?.invoiced.delivered.amount || 0)}
                      <br />
                      Not delivered:
                      {' '}
                      {formatPriceFull(data?.invoiced.notDelivered.amount || 0)}
                    </>
                  )}
                  trigger={(
                    <span>
                      {formatPriceFull(
                        (data?.invoiced.delivered.amount || 0)
                        + (data?.invoiced.notDelivered.amount || 0),
                      )}
                    </span>
                  )}
                />
              </Table.Cell>
              <Table.Cell>{formatPriceFull(data?.suggested.amount || 0)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell># Products</Table.Cell>
              <Table.Cell>{data?.suggested.nrOfProducts}</Table.Cell>
              <Table.Cell>{data?.contracted.nrOfProducts}</Table.Cell>
              <Table.Cell>{data?.delivered.nrOfProducts}</Table.Cell>
              <Table.Cell>
                <Popup
                  content={(
                    <>
                      Delivered:
                      {' '}
                      {data?.invoiced.delivered.nrOfProducts}
                      <br />
                      Not delivered:
                      {' '}
                      {data?.invoiced.notDelivered.nrOfProducts}
                    </>
                  )}
                  trigger={(
                    <span>
                      {(data?.invoiced.delivered.nrOfProducts || 0)
                      + (data?.invoiced.notDelivered.nrOfProducts || 0)}
                    </span>
                  )}
                />
              </Table.Cell>
              <Table.Cell>{data?.paid.nrOfProducts}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

      </Segment>
    );
  }
}

export default DashboardProductInstanceStatusGraph;
