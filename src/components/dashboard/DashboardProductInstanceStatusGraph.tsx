import React from 'react';
import { Popup, Segment, Table } from 'semantic-ui-react';
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
    const client = new Client();
    const data = await client.getDashboardProductInstanceStatistics(2021);
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

  render() {
    const { loading, data } = this.state;
    const chartData = this.createBarChartDataObject();
    return (
      <Segment loading={loading}>
        <h3 style={{ marginBottom: '2em' }}>Contracted products</h3>
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
                    userCallback(value: number) {
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
              <Table.HeaderCell>Suggested</Table.HeaderCell>
              <Table.HeaderCell>Contracted</Table.HeaderCell>
              <Table.HeaderCell>Delivered</Table.HeaderCell>
              <Table.HeaderCell>Invoiced</Table.HeaderCell>
              <Table.HeaderCell>Paid</Table.HeaderCell>
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
                      {(data?.invoiced.delivered.amount || 0)
                      + (data?.invoiced.notDelivered.amount || 0)}
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
