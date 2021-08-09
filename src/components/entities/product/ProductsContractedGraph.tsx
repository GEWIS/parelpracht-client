import React from 'react';
import { Dropdown, Grid, Tab } from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import * as chartjs from 'chart.js';
import 'chartjs-plugin-annotation';
import { AnalysisResultByYear, Client, Product } from '../../../clients/server.generated';
import { DataSet } from '../../chart/CategoryLineChart';
import { formatPriceFull } from '../../../helpers/monetary';

interface Props extends WithTranslation {
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
    const { t } = this.props;
    const { dataSetSelection } = this.state;
    const labels = data.map((x) => x.year);
    let datasets;
    switch (dataSetSelection) {
      case DataSet.VALUES:
        datasets = [{
          text: t('entities.graph.label.value'),
          backgroundColor: 'rgba(41, 48, 101, 0.8)',
          borderColor: 'rgba(41, 48, 101, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255, 148, 128, 0.8)',
          hoverBorderColor: 'rgba(41, 48, 101, 1)',
          data: data.map((x) => x.amount),
        }];
        break;
      case DataSet.AMOUNTS:
        datasets = [{
          text: t('entities.graph.label.amount'),
          backgroundColor: 'rgba(41, 48, 101, 0.8)',
          borderColor: 'rgba(41, 48, 101, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255, 148, 128, 0.8)',
          hoverBorderColor: 'rgba(41, 48, 101, 1)',
          data: data.map((x) => x.nrOfProducts),
        }];
        break;
      default:
    }
    return { labels, datasets };
  };

  createBarChartOptionsObject = () => {
    const { t } = this.props;
    const { product } = this.props;
    const { dataSetSelection } = this.state;
    let options: chartjs.ChartOptions;
    switch (dataSetSelection) {
      case DataSet.VALUES:
        if (product.minTarget === 0) {
          options = {
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
            annotation: {
              annotations: [
                {
                  id: 'maxTarget',
                  type: 'line',
                  value: product.maxTarget * product.targetPrice,
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  borderColor: 'rgba(41, 48, 101, 1)',
                  borderWidth: 2,
                  label: {
                    backgroundColor: 'rgba(41, 48, 101, 0.8)',
                    content: t('entities.graph.target.maximum'),
                    enabled: true,
                  },
                },
              ],
            },
          };
        } else {
          options = {
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
            annotation: {
              annotations: [
                {
                  id: 'minTarget',
                  type: 'line',
                  value: product.minTarget * product.targetPrice,
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  borderColor: 'rgba(41, 48, 101, 1)',
                  borderWidth: 2,
                  label: {
                    backgroundColor: 'rgba(41, 48, 101, 0.8)',
                    content: t('entities.graph.target.minimum'),
                    enabled: true,
                  },
                },
                {
                  id: 'maxTarget',
                  type: 'line',
                  value: product.maxTarget * product.targetPrice,
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  borderColor: 'rgba(41, 48, 101, 1)',
                  borderWidth: 2,
                  label: {
                    backgroundColor: 'rgba(41, 48, 101, 0.8)',
                    content: t('entities.graph.target.maximum'),
                    enabled: true,
                  },
                },
              ],
            },
          };
        }
        break;
      case DataSet.AMOUNTS:
        if (product.minTarget === 0) {
          options = {
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
                    return value;
                  },
                },
              }],
            },
            annotation: {
              annotations: [
                {
                  id: 'maxTarget',
                  type: 'line',
                  value: product.maxTarget,
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  borderColor: 'rgba(41, 48, 101, 1)',
                  borderWidth: 2,
                  label: {
                    backgroundColor: 'rgba(41, 48, 101, 0.8)',
                    content: t('entities.graph.target.maximum'),
                    enabled: true,
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label(tooltipItem: any) {
                  return formatPriceFull(tooltipItem.yLabel);
                },
              },
            },
          };
        } else {
          options = {
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
                    return value;
                  },
                },
              }],
            },
            annotation: {
              annotations: [
                {
                  id: 'minTarget',
                  type: 'line',
                  value: product.minTarget,
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  borderColor: 'rgba(41, 48, 101, 1)',
                  borderWidth: 2,
                  label: {
                    backgroundColor: 'rgba(41, 48, 101, 0.8)',
                    content: t('entities.graph.target.minimum'),
                    enabled: true,
                  },
                },
                {
                  id: 'maxTarget',
                  type: 'line',
                  value: product.maxTarget,
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  borderColor: 'rgba(41, 48, 101, 1)',
                  borderWidth: 2,
                  label: {
                    backgroundColor: 'rgba(41, 48, 101, 0.8)',
                    content: t('entities.graph.target.maximum'),
                    enabled: true,
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label(tooltipItem: any) {
                  return formatPriceFull(tooltipItem.yLabel);
                },
              },
            },
          };
        }
        break;
      default:
        options = {};
    }
    return options;
  };

  render() {
    const { t } = this.props;
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
                  { key: 1, value: DataSet.VALUES, text: t('entities.graph.label.value') },
                  { key: 2, value: DataSet.AMOUNTS, text: t('entities.graph.label.amount') },
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
            redraw
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

export default withTranslation()(ProductsContractedGraph);
