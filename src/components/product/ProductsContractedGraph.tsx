import React from 'react';
import { Dropdown, Grid, Tab } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { AnalysisResultByYear, Client, Product } from '../../clients/server.generated';
import { DataSet } from '../chart/CategoryLineChart';
import { formatPriceFull } from '../../helpers/monetary';

interface Props {
  product: Product;
}

interface State {
  data?: AnalysisResultByYear[];
  loading: boolean;
  dataSetSelection: DataSet;
}

class ProductsContractedGraph extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: undefined,
      loading: true,
      dataSetSelection: DataSet.VALUES,
    };
  }

  async componentDidMount() {
    const { product } = this.props;
    const client = new Client();
    const data = await client.getProductStatistics(product.id);
    this.setState({
      data,
      loading: false,
    });
  }

  changeDataset = (dataSet: DataSet) => {
    this.setState({ dataSetSelection: dataSet });
  };

  createBarChartDataObject = (data: AnalysisResultByYear[]): object => {
    const { dataSetSelection } = this.state;
    const { product } = this.props;

    const labels = data.map((x) => x.year);
    let datasets;
    switch (dataSetSelection) {
      case DataSet.VALUES:
        datasets = [{
          label: 'Values (€)',
          backgroundColor: 'rgba(41, 48, 101, 0.8)',
          borderColor: 'rgba(41, 48, 101, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255, 148, 128, 0.8)',
          hoverBorderColor: 'rgba(41, 48, 101, 1)',
          data: data.map((x) => x.amount),
        }, {
          label: 'Minimum Target (€)',
          labelString: 'Minimum Target',
          type: 'line',
          borderColor: 'rgba(41, 48, 101, 1)',
          borderWidth: 2,
          radius: 2,
          data: [product.targetPrice * product.minTarget, product.targetPrice * product.minTarget],
          fill: false,
          cubicInterpolationMode: 'monotone',
        }, {
          label: 'Maximum Target (€)',
          labelString: 'Maximum Target',
          type: 'line',
          borderColor: 'rgba(41, 48, 101, 1)',
          borderWidth: 2,
          radius: 2,
          data: [product.targetPrice * product.maxTarget, product.targetPrice * product.maxTarget],
          fill: false,
          cubicInterpolationMode: 'monotone',
        },
        ];
        break;
      case DataSet.AMOUNTS:
        datasets = [
          {
            label: 'Amounts',
            backgroundColor: 'rgba(41, 48, 101, 0.8)',
            borderColor: 'rgba(41, 48, 101, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255, 148, 128, 0.8)',
            hoverBorderColor: 'rgba(41, 48, 101, 1)',
            data: data.map((x) => x.nrOfProducts),
          }, {
            label: 'Minimum Target',
            labelString: 'Minimum Target',
            type: 'line',
            backgroundColor: 'rgba(41, 48, 101, 0.8)',
            borderColor: 'rgba(41, 48, 101, 1)',
            borderWidth: 2,
            data: [product.minTarget, product.minTarget],
            fill: false,
            cubicInterpolationMode: 'monotone',
          }, {
            label: 'Maximum Target',
            labelString: 'Maximum Target',
            type: 'line',
            backgroundColor: 'rgba(41, 48, 101, 0.8)',
            borderColor: 'rgba(41, 48, 101, 1)',
            borderWidth: 2,
            data: [product.maxTarget, product.maxTarget],
            fill: false,
            cubicInterpolationMode: 'monotone',
          },
        ];
        break;
      default:
    }
    return { labels, datasets };
  };

  createBarChartOptionsObject = () => {
    const { dataSetSelection } = this.state;
    let options: ChartOptions;
    switch (dataSetSelection) {
      case DataSet.VALUES:
        options = {
          legend: {
            display: true,
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
        };
        break;
      case DataSet.AMOUNTS:
        options = {
          legend: {
            display: true,
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
                  return value;
                },
              },
            }],
          },
          // tooltips: {
          //   callbacks: {
          //     label(tooltipItem: any) {
          //       return formatPriceFull(tooltipItem.yLabel);
          //     },
          //   },
          // },
        };
        break;
      default:
        options = {};
    }
    return options;
  };

  render() {
    const { data, loading, dataSetSelection } = this.state;

    if (data === undefined || loading) {
      return <Tab.Pane loading={loading} />;
    }

    const chartData = this.createBarChartDataObject(data);
    const chartOptions = this.createBarChartOptionsObject();

    return (
      <Tab.Pane>
        <Grid style={{ marginBottom: '1em' }}>
          <Grid.Row columns={2}>
            <Grid.Column textAlign="left">
              <h3>Contracted products</h3>
            </Grid.Column>
            <Grid.Column textAlign="right" verticalAlign="bottom" style={{ fontSize: '1.2em' }}>
              <Dropdown
                options={[
                  { key: 1, value: DataSet.VALUES, text: 'Values (€)' },
                  { key: 2, value: DataSet.AMOUNTS, text: 'Amounts' },
                ]}
                basic
                value={dataSetSelection}
                float="right"
                style={{ marginLeft: '1em' }}
                onChange={(value, d) => this.changeDataset(d.value as DataSet)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div>
          <Bar
            data={chartData}
            options={chartOptions}
          />
        </div>
        <p style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '0.5em' }}>
          * Note that these years are the financial years,
          so 2021 means the association year 2020-2021.
        </p>
      </Tab.Pane>
    );
  }
}

export default ProductsContractedGraph;
