import React from 'react';
import { Dropdown, Grid, Segment } from 'semantic-ui-react';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { CategorySummary, Client, ContractedProductsPerMonth } from '../../clients/server.generated';
import { dateToFinancialYear } from '../../helpers/timestamp';
import { RootState } from '../../stores/store';
import { formatPriceFull } from '../../helpers/monetary';
import { randomColorSet } from '../../helpers/colors';

interface Props {
  categories: CategorySummary[];
}

interface State {
  data?: ContractedProductsPerMonth;
  financialYear: number;
  loading: boolean;
}

class DashboardContractedCategoryGraph extends React.Component<Props, State> {
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
    const data = await client.getContractedProductsStatistics(year);
    this.setState({
      data,
      loading: false,
    });
  }

  createLineChartDataObject(): object {
    const { data } = this.state;
    const { categories } = this.props;

    const catMap = {} as object;
    categories.map((c) => {
      // @ts-ignore Sometimes you just want to write Javascript code,
      // especially when the library you use is Javascript
      // eslint-disable-next-line no-param-reassign
      catMap[c.id] = c.name;
      return catMap;
    });

    const result = {
      labels: ['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [] as object[],
    };
    if (!data) return result;

    data.categories.forEach((c, i) => {
      result.datasets.push({
        // @ts-ignore
        label: catMap[c.categoryId],
        data: c.amount,
        fill: false,
        lineTension: 0,
        backgroundColor: randomColorSet(i),
        borderColor: randomColorSet(i),
        pointBackgroundColor: randomColorSet(i),
      });
    });

    return result;
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
    const { loading, financialYear } = this.state;
    const chartData = this.createLineChartDataObject();
    return (
      <Segment loading={loading}>
        <Grid style={{ marginBottom: '1em' }}>
          <Grid.Row columns={2}>
            <Grid.Column textAlign="left">
              <h3>Contracted products</h3>
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
          <Line
            data={chartData}
            options={{
              legend: {
                display: false,
              },
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
            }}
          />
        </div>
      </Segment>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  categories: state.summaries.ProductCategories.options,
});

export default connect(mapStateToProps)(DashboardContractedCategoryGraph);
