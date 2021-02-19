import React from 'react';
import { Dropdown, Grid } from 'semantic-ui-react';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { formatPriceFull } from '../../helpers/monetary';
import { randomColorSet } from '../../helpers/colors';
import { ProductsPerCategory } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { getCategoryName } from '../../stores/productcategory/selectors';

export enum DataSet {
  VALUES,
  AMOUNTS,
}

interface Props {
  getCatName: (id: number) => string;
  data: ProductsPerCategory[];
  labels: string[];
  extraDropdown?: JSX.Element;
}

interface State {
  dataSetSelection: DataSet;
}

class CategoryLineChart extends React.Component<Props, State> {
  private chartReference: React.RefObject<Line>;

  constructor(props: Props) {
    super(props);
    this.state = {
      dataSetSelection: DataSet.VALUES,
    };
    this.chartReference = React.createRef();
  }

  changeDataset = (newDataset: DataSet) => {
    this.setState({ dataSetSelection: newDataset });
  };

  createLineChartDataObject(): object {
    const { data, labels, getCatName } = this.props;
    const { dataSetSelection } = this.state;

    let valueArray: 'amount' | 'nrOfProducts';
    switch (dataSetSelection) {
      case DataSet.VALUES: valueArray = 'amount'; break;
      case DataSet.AMOUNTS: valueArray = 'nrOfProducts'; break;
      default: throw new Error();
    }

    const result = {
      labels,
      datasets: [] as object[],
    };

    data.forEach((c, i) => {
      // @ts-ignore
      result.datasets.push({
        label: getCatName(c.categoryId),
        data: c[valueArray],
        fill: false,
        lineTension: 0,
        backgroundColor: randomColorSet(i),
        borderColor: randomColorSet(i),
        pointBackgroundColor: randomColorSet(i),
      });
    });

    console.log(result);
    console.log(data);
    return result;
  }

  render() {
    const { extraDropdown } = this.props;
    const { dataSetSelection } = this.state;
    const chartData = this.createLineChartDataObject();

    let options: object = {};
    switch (dataSetSelection) {
      case DataSet.VALUES:
        options = {
          scales: {
            yAxes: [{
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
              label(tooltipItem: any, data: any) {
                const value = formatPriceFull(tooltipItem.yLabel);
                const { label } = data.datasets[tooltipItem.datasetIndex];
                return ` ${label}: ${value}`;
              },
            },
          },
        };
        break;
      case DataSet.AMOUNTS:
        options = {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                userCallback(value: number) {
                  return value;
                },
              },
            }],
          },
          tooltips: {
            callbacks: {
              label(tooltipItem: any, data: any) {
                const value = tooltipItem.yLabel;
                const { label } = data.datasets[tooltipItem.datasetIndex];
                return ` ${label}: ${value}`;
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
              <h3>Contracted products</h3>
            </Grid.Column>
            <Grid.Column textAlign="right" verticalAlign="bottom" style={{ fontSize: '1.2em' }}>
              {extraDropdown}
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
          <Line
            ref={this.chartReference}
            data={chartData}
            options={{
              legend: {
                display: false,
              },
              ...options,
            }}
            redraw
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  getCatName: (id: number): string => getCategoryName(state, id),
});

export default connect(mapStateToProps)(CategoryLineChart);
