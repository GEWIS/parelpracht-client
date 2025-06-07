import { Component } from 'react';
import { Dropdown, Grid, TabPane } from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
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

class ProductsContractedGraph extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: undefined,
      loading: true,
      dataSetSelection: DataSet.VALUES,
    };
  }

  componentDidMount() {
    const { product } = this.props;
    const client = new Client();
    client
      .getProductStatistics(product.id)
      .then((data) => {
        this.setState({
          data,
          loading: false,
        });
      })
      .catch(console.error);
  }

  changeDataset = (dataSet: DataSet) => {
    this.setState({ dataSetSelection: dataSet });
  };

  createBarChartDataObject = (data: AnalysisResultByYear[]): ChartData<'bar'> => {
    const { t } = this.props;
    const { dataSetSelection } = this.state;
    const labels = data.map((x) => x.year);

    const result: ChartData<'bar'> = {
      labels,
      datasets: [],
    };

    switch (dataSetSelection) {
      case DataSet.VALUES:
        result.datasets = [
          {
            // TODO CHECK
            label: t('entities.graph.label.value'),
            backgroundColor: 'rgba(41, 48, 101, 0.8)',
            borderColor: 'rgba(41, 48, 101, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255, 148, 128, 0.8)',
            hoverBorderColor: 'rgba(41, 48, 101, 1)',
            data: data.map((x) => x.amount),
          },
        ];
        break;
      case DataSet.AMOUNTS:
        result.datasets = [
          {
            // TODO CHECK
            label: t('entities.graph.label.amount'),
            backgroundColor: 'rgba(41, 48, 101, 0.8)',
            borderColor: 'rgba(41, 48, 101, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255, 148, 128, 0.8)',
            hoverBorderColor: 'rgba(41, 48, 101, 1)',
            data: data.map((x) => x.nrOfProducts),
          },
        ];
        break;
      default:
    }
    return result;
  };

  createBarChartOptionsObject = (): ChartOptions<'bar'> => {
    const { t } = this.props;
    const { product } = this.props;
    const { dataSetSelection } = this.state;
    let options: ChartOptions<'bar'>;
    switch (dataSetSelection) {
      case DataSet.VALUES:
        if (product.minTarget === 0) {
          options = {
            scales: {
              x: {
                stacked: true,
              },
              y: {
                beginAtZero: true,
                stacked: true,
                ticks: {
                  callback(value: number | string) {
                    if (typeof value === 'string') return 'TEMP';
                    return formatPriceFull(value);
                  },
                },
              },
            },
            plugins: {
              annotation: {
                annotations: [
                  {
                    id: 'maxTarget',
                    type: 'line',
                    value: product.maxTarget * product.targetPrice,
                    scaleID: 'y-axis-0',
                    borderColor: 'rgba(41, 48, 101, 1)',
                    borderWidth: 2,
                    label: {
                      backgroundColor: 'rgba(41, 48, 101, 0.8)',
                      content: t('entities.graph.target.maximum'),
                      display: true,
                    },
                  },
                ],
              },
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label(tooltipItem) {
                    return formatPriceFull(Number(tooltipItem.label));
                  },
                },
              },
            },
          };
        } else {
          options = {
            scales: {
              x: {
                stacked: true,
              },
              y: {
                beginAtZero: true,
                stacked: true,
                ticks: {
                  callback(value: number | string) {
                    if (typeof value === 'string') return 'TEMP';
                    return formatPriceFull(value);
                  },
                },
              },
            },
            plugins: {
              annotation: {
                annotations: [
                  {
                    id: 'minTarget',
                    type: 'line',
                    value: product.minTarget * product.targetPrice,
                    scaleID: 'y-axis-0',
                    borderColor: 'rgba(41, 48, 101, 1)',
                    borderWidth: 2,
                    label: {
                      backgroundColor: 'rgba(41, 48, 101, 0.8)',
                      content: t('entities.graph.target.minimum'),
                      display: true,
                    },
                  },
                  {
                    id: 'maxTarget',
                    type: 'line',
                    value: product.maxTarget * product.targetPrice,
                    scaleID: 'y-axis-0',
                    borderColor: 'rgba(41, 48, 101, 1)',
                    borderWidth: 2,
                    label: {
                      backgroundColor: 'rgba(41, 48, 101, 0.8)',
                      content: t('entities.graph.target.maximum'),
                      display: true,
                    },
                  },
                ],
              },
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label(tooltipItem: TooltipItem<'bar'>) {
                    return formatPriceFull(parseInt(tooltipItem.label));
                  },
                },
              },
            },
          };
        }
        break;
      case DataSet.AMOUNTS:
        if (product.minTarget === 0) {
          options = {
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                  callback(value: number | string) {
                    if (typeof value === 'string') return 'TEMP';
                    return value;
                  },
                },
              },
            },
            plugins: {
              annotation: {
                annotations: [
                  {
                    id: 'maxTarget',
                    type: 'line',
                    value: product.maxTarget,
                    scaleID: 'y-axis-0',
                    borderColor: 'rgba(41, 48, 101, 1)',
                    borderWidth: 2,
                    label: {
                      backgroundColor: 'rgba(41, 48, 101, 0.8)',
                      content: t('entities.graph.target.maximum'),
                      display: true,
                    },
                  },
                ],
              },
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  // TODO CHECK
                  label(tooltipItem: TooltipItem<'bar'>) {
                    return formatPriceFull(parseInt(tooltipItem.label));
                  },
                },
              },
            },
          };
        } else {
          options = {
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                  callback(value: number | string) {
                    return value;
                  },
                },
              },
            },
            plugins: {
              annotation: {
                annotations: [
                  {
                    id: 'minTarget',
                    type: 'line',
                    value: product.minTarget,
                    scaleID: 'y-axis-0',
                    borderColor: 'rgba(41, 48, 101, 1)',
                    borderWidth: 2,
                    label: {
                      backgroundColor: 'rgba(41, 48, 101, 0.8)',
                      content: t('entities.graph.target.minimum'),
                      display: true,
                    },
                  },
                  {
                    id: 'maxTarget',
                    type: 'line',
                    value: product.maxTarget,
                    scaleID: 'y-axis-0',
                    borderColor: 'rgba(41, 48, 101, 1)',
                    borderWidth: 2,
                    label: {
                      backgroundColor: 'rgba(41, 48, 101, 0.8)',
                      content: t('entities.graph.target.maximum'),
                      display: true,
                    },
                  },
                ],
              },
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  // TODO CHECK
                  label(tooltipItem: TooltipItem<'bar'>) {
                    return formatPriceFull(parseInt(tooltipItem.label));
                  },
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
      return <TabPane loading={loading} />;
    }

    const chartData = this.createBarChartDataObject(data);
    const chartOptions = this.createBarChartOptionsObject();

    return (
      <TabPane>
        <Grid style={{ marginBottom: '1em' }}>
          <Grid.Row columns={2}>
            <Grid.Column textAlign="left">
              <h3>{t('entities.product.contractedProducts')}</h3>
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
                onChange={(_, d) => this.changeDataset(d.value as DataSet)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div>
          <Bar data={chartData} options={chartOptions} redraw />
        </div>
        <p style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '0.5em' }}>
          {t('entities.product.warningFinancialYear')}
        </p>
      </TabPane>
    );
  }
}

export default withTranslation()(ProductsContractedGraph);
