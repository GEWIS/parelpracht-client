import { createRef, Component, ReactNode, RefObject } from 'react';
import { Dropdown, Grid } from 'semantic-ui-react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { formatPriceFull } from '../../helpers/monetary';
import { randomColorSet } from '../../helpers/colors';
import { ProductsPerCategory } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { getCategoryName } from '../../stores/productcategory/selectors';

export enum DataSet {
  VALUES,
  AMOUNTS,
}

interface Props extends WithTranslation {
  getCatName: (id: number) => string;
  data: ProductsPerCategory[];
  labels: string[];
  extraDropdown?: ReactNode;
}

interface State {
  dataSetSelection: DataSet;
}

class CategoryLineChart extends Component<Props, State> {
  static defaultProps = {
    extraDropdown: undefined,
  };

  private chartReference: RefObject<ChartJSOrUndefined<'line'>>;

  constructor(props: Props) {
    super(props);
    this.state = {
      dataSetSelection: DataSet.VALUES,
    };
    this.chartReference = createRef();
  }

  changeDataset = (newDataset: DataSet) => {
    this.setState({ dataSetSelection: newDataset });
  };

  createLineChartDataObject(): ChartData<'line'> {
    const { data, labels, getCatName } = this.props;
    const { dataSetSelection } = this.state;

    let valueArray: 'amount' | 'nrOfProducts';
    switch (dataSetSelection) {
      case DataSet.VALUES:
        valueArray = 'amount';
        break;
      case DataSet.AMOUNTS:
        valueArray = 'nrOfProducts';
        break;
      default:
        throw new Error();
    }

    const result: ChartData<'line'> = {
      labels,
      datasets: [],
    };

    data.forEach((c, i) => {
      result.datasets.push({
        label: getCatName(c.categoryId),
        data: c[valueArray],
        fill: false,
        backgroundColor: randomColorSet(i),
        borderColor: randomColorSet(i),
        pointBackgroundColor: randomColorSet(i),
      });
    });

    return result;
  }

  render() {
    const { t } = this.props;
    const { extraDropdown } = this.props;
    const { dataSetSelection } = this.state;
    const chartData = this.createLineChartDataObject();

    let options: ChartOptions<'line'> = {};
    switch (dataSetSelection) {
      case DataSet.VALUES:
        options = {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback(value: number | string) {
                  // First case should never apply
                  if (typeof value === 'string') return formatPriceFull(parseInt(value));
                  return formatPriceFull(value);
                },
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label(tooltipItem) {
                  const value = formatPriceFull(tooltipItem.raw as number);
                  const { label } = tooltipItem.dataset;
                  return ` ${label}: ${value}`;
                },
              },
            },
          },
        };
        break;
      case DataSet.AMOUNTS:
        options = {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback(value: number | string) {
                  return value;
                },
                precision: 0,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label(tooltipItem) {
                  const value = tooltipItem.raw as number;
                  const { label } = tooltipItem.dataset;
                  return ` ${label}: ${value}`;
                },
              },
            },
          },
        };
        break;
      default:
    }

    return (
      <>
        <Grid style={{ marginBottom: '1em' }}>
          <Grid.Row columns={2}>
            <Grid.Column textAlign="left">
              <h3>{t('dashboard.categoryLinechart.header')}</h3>
            </Grid.Column>
            <Grid.Column textAlign="right" verticalAlign="bottom" style={{ fontSize: '1.2em' }}>
              {extraDropdown}
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
          <Line ref={this.chartReference} data={chartData} options={options} redraw />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  getCatName: (id: number): string => getCategoryName(state, id),
});

export default withTranslation()(connect(mapStateToProps)(CategoryLineChart));
